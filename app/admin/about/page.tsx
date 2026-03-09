'use client'

import { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Target, Cpu, Save, Loader2, Plus, Layout, Smartphone, Database, Wrench, Image as ImageIcon, Globe, Calendar, Github, Upload, Trash2, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { uploadAsset, deleteAsset, BUCKETS, getPathFromUrl } from '@/lib/supabase/storage'
import { saveAdminProfile } from './actions'

type AvatarMode = 'github' | 'upload'

export default function AboutAdmin() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [techStacksStr, setTechStacksStr] = useState<Record<string, string>>({})
  const [avatarMode, setAvatarMode] = useState<AvatarMode>('github')
  const [githubAvatarUrl, setGithubAvatarUrl] = useState('')
  const [uploadProgress, setUploadProgress] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    
    // Fetch dynamic taglines and contact description stored in settings
    const { data: settingsData } = await supabase.from('settings').select('value').eq('key', 'site_content').maybeSingle()
    const content = settingsData?.value || {}

    if (data) {
      setProfile({
        ...data,
        contact_description: content.contact_description || data.contact_description,
        projects_tagline: content.projects_tagline,
        narrative_tagline: content.narrative_tagline
      })
      setTechStacksStr(
        Object.keys(data.tech_stacks || {}).reduce((acc, key) => ({
          ...acc,
          [key]: data.tech_stacks[key]?.join(', ') || ''
        }), {})
      )
      // Determine current avatar mode
      if (data.avatar_url?.includes('github') || data.github_avatar_url) {
        setAvatarMode('github')
        setGithubAvatarUrl(data.github_avatar_url || data.avatar_url || '')
      } else if (data.avatar_url) {
        setAvatarMode('upload')
      } else {
        setAvatarMode('github')
      }
    }
    setLoading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    
    // Save to profile table
    const profileUpdate = {
        id: profile.id,
        bio: profile.bio,
        core_values: profile.core_values,
        metrics: profile.metrics,
        philosophy: profile.philosophy,
        apps_delivered: profile.apps_delivered,
        happy_clients: profile.happy_clients,
        tech_stacks: Object.keys(techStacksStr).reduce((acc, key) => ({
          ...acc,
          [key]: techStacksStr[key]?.split(',').map((s: string) => s.trim()).filter(Boolean) || []
        }), {}),
        experience_start_date: profile.experience_start_date,
        manual_years_experience: profile.manual_years_experience,
        name: profile.full_name || profile.name, // The DB column is 'name'
        tagline: profile.tagline,
        updated_at: new Date().toISOString()
    }

    // Save to settings table for fields not in profile schema
    const settingsUpdate = {
        contact_description: profile.contact_description || profile.contactDescription,
        projects_tagline: profile.projects_tagline || profile.projectsTagline,
        narrative_tagline: profile.narrative_tagline || profile.narrativeTagline,
    }

    const result = await saveAdminProfile(profileUpdate, settingsUpdate)

    if (!result.success) {
      console.error('Error saving profile or settings:', result.profileError || result.settingsError)
      alert('Error saving profile changes')
    } else {
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    }
    setSaving(false)
  }

  /**
   * Deletes the previously uploaded avatar from storage if it exists.
   * Should be called before switching avatar mode or uploading new one.
   */
  const deleteOldStorageAvatar = async () => {
    if (!profile?.avatar_url) return
    // Only delete if it's a storage URL (not GitHub)
    const isStorage = profile.avatar_url.includes('/storage/v1/object/public/')
    if (!isStorage) return
    try {
      await deleteAsset(BUCKETS.AVATARS, profile.avatar_url)
    } catch (e) {
      console.warn('Old avatar cleanup:', e)
    }
  }

  /**
   * Handles avatar file upload with browser-side WebP compression.
   */
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !profile) return

    try {
      setUploadProgress(true)
      // Delete old storage avatar before uploading new one
      await deleteOldStorageAvatar()

      const path = `avatar-${profile.id}-${Date.now()}.webp`
      const url = await uploadAsset(BUCKETS.AVATARS, file, path)

      const supabase = createClient()
      await supabase.from('profile').update({
        avatar_url: url,
        github_avatar_url: null // clear github url when using upload
      }).eq('id', profile.id)

      setProfile({ ...profile, avatar_url: url, github_avatar_url: null })
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      console.error('Avatar upload failed:', err)
      alert('Avatar upload failed. Check Supabase Storage bucket permissions.')
    } finally {
      setUploadProgress(false)
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  /**
   * Saves GitHub profile URL as avatar source.
   * Deletes any existing storage avatar to free up space.
   */
  const handleSaveGithubAvatar = async () => {
    if (!githubAvatarUrl.trim() || !profile) return
    setUploadProgress(true)
    try {
      // Delete old storage avatar if switching from upload to GitHub
      await deleteOldStorageAvatar()

      const supabase = createClient()
      await supabase.from('profile').update({
        avatar_url: githubAvatarUrl,
        github_avatar_url: githubAvatarUrl
      }).eq('id', profile.id)

      setProfile({ ...profile, avatar_url: githubAvatarUrl, github_avatar_url: githubAvatarUrl })
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      console.error('Failed to save GitHub avatar:', err)
    } finally {
      setUploadProgress(false)
    }
  }

  // Reactive GitHub Avatar logic
  const getPreviewAvatar = () => {
    if (avatarMode === 'github') {
      if (githubAvatarUrl.trim()) {
        // Handle common github profile links to .png conversion
        if (githubAvatarUrl.includes('github.com/') && !githubAvatarUrl.includes('.png')) {
           return githubAvatarUrl.endsWith('/') ? `${githubAvatarUrl.slice(0, -1)}.png` : `${githubAvatarUrl}.png`
        }
        return githubAvatarUrl
      }
      return profile?.github_avatar_url || profile?.avatar_url
    }
    return profile?.avatar_url
  }


  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="animate-spin text-indigo-500" size={32} />
    </div>
  )

  if (!profile) return (
    <div className="flex items-center justify-center min-h-[400px] text-gray-400">
      No profile found. Make sure the database has a profile row.
    </div>
  )

  const currentAvatar = profile.avatar_url
  const isStorageAvatar = currentAvatar && currentAvatar.includes('/storage/v1/object/public/')

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-text-primary mb-2">About Me</h1>
          <p className="text-text-secondary font-medium">Refine your narrative, metrics, and technical ecosystem.</p>
        </div>
        <div className="flex items-center gap-3">
          <AnimatePresence>
            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-emerald-400 text-sm font-bold"
              >
                <CheckCircle2 size={16} /> Saved!
              </motion.div>
            )}
          </AnimatePresence>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-4 rounded-xl bg-accent hover:bg-accent/90 text-white text-sm font-black uppercase tracking-widest shadow-xl flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Push Changes
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Professional Narrative */}
          <Card className="p-8 border-border bg-surface/50 backdrop-blur-xl shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-accent/10 text-accent">
                <User size={20} />
              </div>
              <h2 className="text-xl font-black text-text-primary">Identity & Narrative</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary/60 ml-1">Full Name</label>
                <input
                  type="text"
                  value={profile.full_name || profile.name || ''}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value, full_name: e.target.value })}
                  className="w-full p-4 rounded-xl bg-surface/30 border border-border focus:border-accent/40 outline-none text-text-primary text-sm font-bold"
                  placeholder="e.g. Creative Developer"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary/60 ml-1">Home Section Tagline</label>
                <input
                  type="text"
                  value={profile.tagline || ''}
                  onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                  className="w-full p-4 rounded-xl bg-surface/30 border border-border focus:border-accent/40 outline-none text-text-primary text-sm font-bold"
                  placeholder="e.g. Architecting premium digital ecosystems..."
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary/60 ml-1">Projects Section Tagline</label>
                <input
                  type="text"
                  value={profile.projects_tagline || profile.projectsTagline || ''}
                  onChange={(e) => setProfile({ ...profile, projects_tagline: e.target.value, projectsTagline: e.target.value })}
                  className="w-full p-4 rounded-xl bg-surface/30 border border-border focus:border-accent/40 outline-none text-text-primary text-sm font-bold"
                  placeholder="e.g. A curated selection of my recent works..."
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary/60 ml-1">Narrative Section Tagline</label>
                <input
                  type="text"
                  value={profile.narrative_tagline || profile.narrativeTagline || ''}
                  onChange={(e) => setProfile({ ...profile, narrative_tagline: e.target.value, narrativeTagline: e.target.value })}
                  className="w-full p-4 rounded-xl bg-surface/30 border border-border focus:border-accent/40 outline-none text-text-primary text-sm font-bold"
                  placeholder="e.g. A specialized window into the vision..."
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary/60 ml-1">Contact Section Description</label>
              <textarea
                value={profile.contact_description || profile.contactDescription || ''}
                onChange={(e) => setProfile({ ...profile, contact_description: e.target.value, contactDescription: e.target.value })}
                className="w-full h-24 p-4 rounded-xl bg-surface/30 border border-border focus:border-accent/40 outline-none text-text-primary text-sm font-medium leading-relaxed resize-none"
                placeholder="Have a project in mind or just want to say hi? Feel free to reach out!"
              />
              <p className="text-[10px] text-text-secondary/50 ml-1">Shown as the subtitle on the Contact section of the homepage.</p>
            </div>
          </Card>

          {/* Stats & Growth */}
          <Card className="p-8 border-border bg-surface/50 backdrop-blur-xl shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-accent/10 text-accent">
                <Target size={20} />
              </div>
              <h2 className="text-xl font-black text-text-primary">Engagement Metrics & Experience</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary/60 ml-1">Apps Delivered</label>
                <input
                  type="text"
                  value={profile.apps_delivered || ''}
                  onChange={(e) => setProfile({ ...profile, apps_delivered: e.target.value })}
                  className="w-full p-4 rounded-xl bg-surface/30 border border-border focus:border-accent/40 outline-none text-text-primary text-sm font-bold"
                  placeholder="e.g. 15+"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary/60 ml-1">Happy Clients</label>
                <input
                  type="text"
                  value={profile.happy_clients || ''}
                  onChange={(e) => setProfile({ ...profile, happy_clients: e.target.value })}
                  className="w-full p-4 rounded-xl bg-surface/30 border border-border focus:border-accent/40 outline-none text-text-primary text-sm font-bold"
                  placeholder="e.g. 100%"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary/60 ml-1">Manual Years of Experience (Optional)</label>
                <input
                  type="number"
                  value={profile.manual_years_experience || ''}
                  onChange={(e) => setProfile({ ...profile, manual_years_experience: e.target.value ? parseInt(e.target.value) : null })}
                  className="w-full p-4 rounded-xl bg-surface/30 border border-border focus:border-accent/40 outline-none text-text-primary text-sm font-bold"
                  placeholder="Leave empty for auto-calculate"
                />
                <p className="text-[10px] text-text-secondary/50 mt-1">If empty, years are calculated from the start date.</p>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary/60 ml-1">Experience Start Date (For Auto-calc)</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary/50" size={16} />
                  <input
                    type="date"
                    value={profile.experience_start_date || ''}
                    onChange={(e) => setProfile({ ...profile, experience_start_date: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-surface/30 border border-border focus:border-accent/40 outline-none text-text-primary text-sm font-bold"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Technical Ecosystem */}
          <Card className="p-8 border-border bg-surface/50 backdrop-blur-xl shadow-sm space-y-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-accent/10 text-accent">
                <Cpu size={20} />
              </div>
              <h2 className="text-xl font-black text-text-primary">Technical Ecosystem</h2>
            </div>
            <p className="text-text-secondary/50 text-[10px] font-bold uppercase tracking-widest">Technologies (Comma separated)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { key: 'mobile', icon: Smartphone, label: 'Mobile' },
                { key: 'frontend', icon: Layout, label: 'Frontend' },
                { key: 'backend', icon: Database, label: 'Backend' },
                { key: 'tools', icon: Wrench, label: 'Tools & DevOps' }
              ].map((stack) => (
                <div key={stack.key} className="space-y-3">
                  <div className="flex items-center gap-2 mb-1">
                    <stack.icon size={14} className="text-accent" />
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary/60">{stack.label}</label>
                  </div>
                  <textarea
                    value={techStacksStr[stack.key] ?? ''}
                    onChange={(e) => setTechStacksStr({ ...techStacksStr, [stack.key]: e.target.value })}
                    placeholder="Flutter, React Native, Swift..."
                    className="w-full p-4 rounded-xl bg-surface/30 border border-border focus:border-accent/40 outline-none text-text-primary text-xs font-bold min-h-[80px] transition-all"
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-6">
          <Card className="p-8 border-border bg-surface/50 backdrop-blur-xl shadow-sm sticky top-8 space-y-8">
            {/* Avatar Section */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-text-secondary/60 mb-6">Profile Avatar</h3>
              
              {/* Avatar Preview */}
              <div className="flex flex-col items-center gap-4 mb-6">
                <div className="relative group w-28 h-28">
                  <div className="absolute inset-0 bg-accent/20 rounded-full blur-2xl group-hover:bg-accent/30 transition-all" />
                  <div className="relative w-full h-full rounded-full border-2 border-border overflow-hidden bg-surface-secondary/50">
                    {getPreviewAvatar() ? (
                      <img 
                        src={getPreviewAvatar()!} 
                        alt="Avatar Preview" 
                        className="w-full h-full object-cover transition-opacity" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-secondary/30">
                        <ImageIcon size={28} />
                      </div>
                    )}
                  </div>
                  {isStorageAvatar && avatarMode === 'upload' && (
                    <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-accent text-white text-[9px] font-black uppercase shadow-lg">Uploaded</div>
                  )}
                  {(!isStorageAvatar || avatarMode === 'github') && (githubAvatarUrl || currentAvatar) && (
                    <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-black uppercase shadow-lg">GitHub</div>
                  )}
                </div>
              </div>

              {/* Mode Selector */}
              <div className="flex rounded-xl overflow-hidden border border-border mb-6">
                <button
                  onClick={() => setAvatarMode('github')}
                  className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 ${avatarMode === 'github' ? 'bg-accent text-white' : 'bg-surface/50 text-text-secondary/60 hover:text-text-primary'}`}
                >
                  <Github size={12} /> GitHub URL
                </button>
                <button
                  onClick={() => setAvatarMode('upload')}
                  className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 ${avatarMode === 'upload' ? 'bg-accent text-white' : 'bg-surface/50 text-text-secondary/60 hover:text-text-primary'}`}
                >
                  <Upload size={12} /> Upload File
                </button>
              </div>

              {/* GitHub URL Mode */}
              <AnimatePresence mode="wait">
                {avatarMode === 'github' && (
                  <motion.div
                    key="github"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-4"
                  >
                    <p className="text-[10px] text-text-secondary/40 font-medium">Paste your GitHub avatar URL. Sync happens in real-time below.</p>
                    <input
                      type="url"
                      value={githubAvatarUrl}
                      onChange={(e) => setGithubAvatarUrl(e.target.value)}
                      className="w-full p-4 rounded-xl bg-surface/30 border border-border focus:border-accent/40 outline-none text-text-primary text-xs font-bold transition-all"
                      placeholder="https://github.com/username.png"
                    />
                    <button
                      onClick={handleSaveGithubAvatar}
                      disabled={uploadProgress || !githubAvatarUrl.trim()}
                      className="w-full py-4 rounded-xl bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl shadow-accent/10"
                    >
                      {uploadProgress ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                      Save Sync URL
                    </button>
                  </motion.div>
                )}

                {/* File Upload Mode */}
                {avatarMode === 'upload' && (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-4"
                  >
                    <p className="text-[10px] text-text-secondary/40 font-medium text-center">WebP compression applied automatically.</p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadProgress}
                      className="w-full py-8 rounded-2xl border-2 border-dashed border-border hover:border-accent/40 text-text-secondary/60 hover:text-text-primary bg-surface/30 transition-all flex flex-col items-center justify-center gap-3 group"
                    >
                      {uploadProgress ? (
                        <div className="flex flex-col items-center gap-2">
                           <Loader2 size={24} className="animate-spin text-accent" />
                           <span className="text-[10px] font-black uppercase">Processing...</span>
                        </div>
                      ) : (
                        <>
                          <div className="p-3 rounded-xl bg-accent/10 text-accent group-hover:scale-110 transition-transform">
                            <Upload size={20} />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest">Choose Image</span>
                        </>
                      )}
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleAvatarUpload}
                      className="hidden"
                      accept="image/*"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="h-px bg-border/50" />

            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-text-secondary/60 mb-4">Philosophy / Hero Quote</h3>
              <textarea
                value={profile.philosophy || ''}
                onChange={(e) => setProfile({ ...profile, philosophy: e.target.value })}
                className="w-full p-4 rounded-xl bg-surface/30 border border-border focus:border-accent/40 outline-none text-text-primary text-xs font-medium min-h-[120px] transition-all"
                placeholder="Your professional mission statement..."
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
