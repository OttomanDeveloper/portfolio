'use client'

import { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Shield, Zap, Activity, Globe, Save, Loader2, Mail, Phone, Youtube, FileText, Plus, ExternalLink, Link2, AlertCircle, Lock, Eye, EyeOff } from 'lucide-react'
import { getSystemHealth } from '@/lib/api-client'
import { createClient } from '@/lib/supabase/client'
import { uploadAsset, deleteAsset, BUCKETS } from '@/lib/supabase/storage'
import { getGithubAvatarUrl } from '@/lib/github-utils'
import { useIsMobile } from '@/hooks/use-mobile'

import { Profile } from '@/lib/types'

export default function SettingsAdmin() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [securitySaving, setSecuritySaving] = useState(false)
  const [health, setHealth] = useState({ status: 'checking', latency: 0 })
  const [profile, setProfile] = useState<Profile | null>(null)
  const isMobile = useIsMobile()
  
  // Security State
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const resumeInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const init = async () => {
      await fetchProfile()
      await checkHealth()
    }
    init()
    const interval = setInterval(checkHealth, 30000)
    return () => clearInterval(interval)
  }, [])

  const checkHealth = async () => {
    const status = await getSystemHealth()
    setHealth(status)
  }

  const fetchProfile = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('profile')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    
    if (data) setProfile(data)
    setLoading(false)
  }

  const handleSave = async () => {
    if (!profile) return
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('profile')
      .update({
        contact_email: profile.contact_email,
        whatsapp_number: profile.whatsapp_number,
        youtube_url: profile.youtube_url,
        social_links: profile.social_links
      })
      .eq('id', profile.id)

    if (error) {
      console.error('Error saving settings:', error)
      alert('Failed to save settings')
    } else {
      alert('Settings updated successfully')
    }
    setSaving(false)
  }

  const handlePasswordChange = async () => {
    if (!password || password !== confirmPassword) {
      alert('Passwords do not match or are empty')
      return
    }

    setSecuritySaving(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      console.error('Security update failed:', error)
      alert(`Security update failed: ${error.message}`)
    } else {
      alert('Password updated successfully')
      setPassword('')
      setConfirmPassword('')
    }
    setSecuritySaving(false)
  }

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !profile) return

    try {
      setSaving(true)
      if (profile.resume_url) {
        try {
          await deleteAsset(BUCKETS.RESUMES, profile.resume_url)
        } catch (e) {
          console.log('Old resume not found or already deleted')
        }
      }

      const path = `resume-${Date.now()}.pdf`
      const url = await uploadAsset(BUCKETS.RESUMES, file, path)
      
      const supabase = createClient()
      await supabase.from('profile').update({ resume_url: url }).eq('id', profile.id)
      
      setProfile({ ...profile, resume_url: url })
      alert('Resume uploaded successfully')
    } catch (err) {
      console.error('Resume upload failed:', err)
      alert('Resume upload failed. Check Supabase Storage permissions.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="animate-spin text-accent" size={32} />
    </div>
  )

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-text-primary mb-2">System Settings</h1>
          <p className="text-text-secondary font-medium">Fine-tune your professional ecosystem and communication channels.</p>
        </div>
        <Button 
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-4 rounded-xl bg-accent hover:bg-accent/90 text-white text-sm font-black uppercase tracking-widest shadow-xl flex items-center gap-2"
        >
          {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          Apply Config
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Communication & Social */}
        <Card className={`p-8 border-border bg-surface/50 space-y-8 ${!isMobile ? 'backdrop-blur-xl' : 'shadow-md'}`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-accent/10 text-accent">
                <Globe size={20} />
            </div>
            <h2 className="text-xl font-black text-text-primary">Communication Hub</h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-1">Contact Receiver Email</label>
                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary/60" size={16} />
                    <input 
                        type="email" 
                        value={profile?.contact_email || ''}
                        onChange={(e) => profile && setProfile({ ...profile, contact_email: e.target.value })}
                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-surface border border-border focus:border-accent/40 outline-none text-text-primary text-sm font-bold shadow-sm"
                        placeholder="you@example.com"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-1">WhatsApp Number</label>
                    <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary/60" size={16} />
                        <input 
                            type="text" 
                            value={profile?.whatsapp_number || ''}
                            onChange={(e) => profile && setProfile({ ...profile, whatsapp_number: e.target.value })}
                            className="w-full pl-12 pr-4 py-4 rounded-xl bg-surface border border-border focus:border-accent/40 outline-none text-text-primary text-sm font-bold shadow-sm"
                            placeholder="+123456789"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-1">YouTube Channel URL</label>
                    <div className="relative">
                        <Youtube className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary/60" size={16} />
                        <input 
                            type="text" 
                            value={profile?.youtube_url || ''}
                            onChange={(e) => profile && setProfile({ ...profile, youtube_url: e.target.value })}
                            className="w-full pl-12 pr-4 py-4 rounded-xl bg-surface border border-border focus:border-accent/40 outline-none text-text-primary text-sm font-bold shadow-sm"
                            placeholder="youtube.com/@c/..."
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-1">Universal Social Links</label>
                {['github', 'linkedin', 'twitter', 'instagram'].map((key) => (
                    <div key={key} className="relative">
                        <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary/60" size={16} />
                        <input 
                            type="text" 
                            value={profile?.social_links?.[key] || ''}
                            onChange={(e) => {
                                if (!profile) return
                                const socials = { ...(profile.social_links || {}) }
                                socials[key] = e.target.value
                                setProfile({ ...profile, social_links: socials })
                            }}
                            className="w-full pl-12 pr-4 py-4 rounded-xl bg-surface border border-border focus:border-accent/40 outline-none text-text-primary text-xs font-bold shadow-sm"
                            placeholder={`${key.charAt(0).toUpperCase() + key.slice(1)} URL`}
                        />
                    </div>
                ))}
            </div>
          </div>
        </Card>

        <div className="space-y-8">
            {/* Security Section */}
            <Card className={`p-8 border-border bg-surface/50 ${!isMobile ? 'backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-500' : 'shadow-md'}`}>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
                        <Shield size={20} />
                    </div>
                    <h2 className="text-xl font-black text-text-primary">Admin Security</h2>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-1">Change Account Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary/60" size={16} />
                            <input 
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-12 py-4 rounded-xl bg-surface border border-border focus:border-accent/40 outline-none text-text-primary text-sm font-bold"
                                placeholder="New Password"
                            />
                            <button 
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-accent transition-colors"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <input 
                            type={showPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-4 rounded-xl bg-surface border border-border focus:border-accent/40 outline-none text-text-primary text-sm font-bold"
                            placeholder="Confirm New Password"
                        />
                    </div>
                    <Button 
                        onClick={handlePasswordChange}
                        disabled={securitySaving}
                        className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                    >
                        {securitySaving ? <Loader2 className="animate-spin" size={16} /> : <Shield size={16} />}
                        Update Security Credentials
                    </Button>
                </div>
            </Card>

            {/* Asset Management */}
            <Card className={`p-8 border-border bg-surface/50 space-y-6 ${!isMobile ? 'backdrop-blur-xl' : 'shadow-md'}`}>
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-accent/10 text-accent">
                        <FileText size={20} />
                    </div>
                    <h2 className="text-xl font-black text-text-primary">Professional Assets</h2>
                </div>

                <div className="p-6 rounded-2xl bg-surface border border-border flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                            <FileText size={24} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-bold text-text-primary truncate">Professional CV / Resume</p>
                            <p className="text-[10px] text-text-secondary font-medium">{profile?.resume_url ? 'Active & Synced' : 'No file uploaded'}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {profile?.resume_url && (
                             <a href={profile.resume_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-surface border border-border text-text-secondary hover:text-accent transition-all">
                                <ExternalLink size={16} />
                            </a>
                        )}
                        <button 
                            onClick={() => resumeInputRef.current?.click()}
                            className="p-2 rounded-lg bg-accent text-white hover:bg-accent/90 shadow-lg shadow-accent/20 transition-all active:scale-95"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                </div>
                <input 
                    type="file" 
                    ref={resumeInputRef} 
                    onChange={handleResumeUpload}
                    className="hidden" 
                    accept=".pdf,.doc,.docx"
                />
            </Card>

            {/* System Health */}
            <Card className={`p-8 border-border bg-surface/50 space-y-8 ${!isMobile ? 'backdrop-blur-xl' : 'shadow-md'}`}>
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-accent/10 text-accent">
                        <Activity size={20} />
                    </div>
                    <h2 className="text-xl font-black text-text-primary">Ecosystem Health</h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 rounded-3xl bg-surface border border-border flex flex-col items-center text-center gap-2 shadow-sm">
                        <Globe size={24} className={health.status === 'healthy' ? 'text-emerald-500' : 'text-rose-500'} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary">DB Connectivity</span>
                        <span className="text-lg font-black text-text-primary uppercase leading-none">{health.status}</span>
                    </div>
                    <div className="p-6 rounded-3xl bg-surface border border-border flex flex-col items-center text-center gap-2 shadow-sm">
                        <Zap size={24} className="text-amber-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Latency</span>
                        <span className="text-lg font-black text-text-primary leading-none">{health.latency}ms</span>
                    </div>
                </div>

                {health.status === 'error' && (
                    <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3 text-rose-500">
                        <AlertCircle size={18} />
                        <p className="text-xs font-bold font-medium">Supabase core unstable. Verify environment variables.</p>
                    </div>
                )}
            </Card>
        </div>
      </div>
    </div>
  )
}
