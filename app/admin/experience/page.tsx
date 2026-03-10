'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, X, Loader2, Save, Calendar, MapPin, Briefcase } from 'lucide-react'
import { getExperiences } from '@/lib/api'
import { adminSaveExperience, adminDeleteExperience } from '../actions'
import { Experience } from '@/lib/types'

interface ExperienceForm extends Partial<Experience> {
  technologiesStr?: string;
  descriptionStr?: string;
  achievementsStr?: string;
}

export default function ExperienceAdmin() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingExp, setEditingExp] = useState<ExperienceForm | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    fetchExperiences()
  }, [])

  const fetchExperiences = async () => {
    setIsLoading(true)
    try {
      const data = await getExperiences()
      setExperiences(data)
    } catch (error) {
      console.error('Error fetching experiences:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (exp: Experience) => {
    setEditingExp({ 
      ...exp,
      technologiesStr: Array.isArray(exp.technologies) ? exp.technologies.join(', ') : '',
      descriptionStr: Array.isArray(exp.description) ? exp.description.join('\n') : '',
      achievementsStr: Array.isArray(exp.achievements) ? exp.achievements.join('\n') : ''
    })
    setIsEditing(true)
  }

  const handleAddNew = () => {
    setEditingExp({
      id: `new-${Date.now()}`,
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: 'Present',
      technologiesStr: '',
      descriptionStr: '',
      achievementsStr: ''
    })
    setIsEditing(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await adminDeleteExperience(id)
      if (error) throw new Error(error)
      setExperiences(experiences.filter(e => e.id !== id))
      setShowDeleteConfirm(null)
    } catch (error) {
      console.error('Error deleting experience:', error)
      alert('Failed to delete experience')
    }
  }

  const handleSave = async () => {
    if (!editingExp) return
    if (!editingExp.company?.trim() || !editingExp.position?.trim()) {
      alert('Company and Position are mandatory fields.')
      return
    }
    setIsSaving(true)
    try {
      const payload = {
          ...editingExp,
          technologies: editingExp.technologiesStr?.split(',').map((s: string) => s.trim()).filter(Boolean) || [],
          description: editingExp.descriptionStr?.split('\n').filter(Boolean) || [],
          achievements: editingExp.achievementsStr?.split('\n').filter(Boolean) || []
      }
      
      // Remove temporary string fields from payload
      const finalPayload = { ...payload };
      delete finalPayload.technologiesStr;
      delete finalPayload.descriptionStr;
      delete finalPayload.achievementsStr;

      const { error } = await adminSaveExperience(finalPayload as Experience)
      if (error) throw new Error(error)
      
      await fetchExperiences()
      setIsEditing(false)
      setEditingExp(null)
    } catch (error) {
      console.error('Error saving experience:', error)
      alert('Failed to save experience')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Experience Management</h1>
          <p className="text-text-secondary">Manage your work history and achievements</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-accent hover:bg-accent/80 text-white rounded-lg transition-colors whitespace-nowrap font-bold"
        >
          <Plus size={20} />
          Add Experience
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-indigo-500" size={40} />
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {experiences.map((exp) => (
              <motion.div
                key={exp.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-surface/50 border border-border rounded-2xl p-6 hover:border-accent/40 transition-all group relative shadow-sm hover:shadow-md"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center shrink-0 border border-accent/20">
                      <Briefcase className="text-accent" size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-text-primary">{exp.position}</h3>
                      <p className="text-accent font-bold">{exp.company}</p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-text-secondary font-medium">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-text-secondary/70" />
                          {exp.startDate} - {exp.endDate}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin size={14} className="text-text-secondary/70" />
                          {exp.location}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 md:absolute md:top-6 md:right-6">
                    <button 
                      onClick={() => handleEdit(exp)}
                      className="p-2 text-text-secondary hover:text-accent hover:bg-accent/10 rounded-lg transition-all"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button 
                      onClick={() => setShowDeleteConfirm(exp.id.toString())}
                      className="p-2 text-text-secondary hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                {exp.description && exp.description.length > 0 && (
                  <ul className="mt-4 space-y-2 text-sm text-gray-400 px-4">
                    {exp.description.slice(0, 2).map((item: string, i: number) => (
                      <li key={i} className="list-disc list-outside leading-relaxed">{item}</li>
                    ))}
                    {exp.description.length > 2 && <li className="text-gray-500">+{exp.description.length - 2} more...</li>}
                  </ul>
                )}

                <div className="flex flex-wrap gap-2 mt-4">
                  {exp.technologies?.map((tech: string) => (
                    <span key={tech} className="text-[10px] font-bold px-2 py-0.5 bg-surface text-text-secondary rounded-md border border-border">
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Editor Modal */}
      <AnimatePresence>
        {isEditing && editingExp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsEditing(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary/30">
                <h2 className="text-xl font-bold text-text-primary">
                  {editingExp.id?.toString().startsWith('new-') ? 'Add New Experience' : 'Edit Experience'}
                </h2>
                <button onClick={() => setIsEditing(false)} className="text-text-secondary hover:text-text-primary transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-text-secondary/60 mb-1 ml-1">Position / Role</label>
                      <input 
                        type="text"
                        value={editingExp.position}
                        onChange={(e) => setEditingExp({ ...editingExp, position: e.target.value })}
                        placeholder="e.g. Senior Mobile Developer"
                        className="w-full px-4 py-3 bg-surface-secondary/50 border border-border rounded-xl text-text-primary font-bold outline-none focus:ring-2 focus:ring-accent/40 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-text-secondary/60 mb-1 ml-1">Company</label>
                      <input 
                        type="text"
                        value={editingExp.company}
                        onChange={(e) => setEditingExp({ ...editingExp, company: e.target.value })}
                        placeholder="e.g. Google"
                        className="w-full px-4 py-3 bg-surface-secondary/50 border border-border rounded-xl text-text-primary font-bold outline-none focus:ring-2 focus:ring-accent/40 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-text-secondary/60 mb-1 ml-1">Location</label>
                      <input 
                        type="text"
                        value={editingExp.location}
                        onChange={(e) => setEditingExp({ ...editingExp, location: e.target.value })}
                        placeholder="e.g. Remote / New York, NY"
                        className="w-full px-4 py-3 bg-surface-secondary/50 border border-border rounded-xl text-text-primary outline-none focus:ring-2 focus:ring-accent/40 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-text-secondary/60 mb-1 ml-1">Start Date</label>
                        <input 
                          type="text"
                          value={editingExp.startDate}
                          onChange={(e) => setEditingExp({ ...editingExp, startDate: e.target.value })}
                          placeholder="e.g. 2022"
                          className="w-full px-4 py-3 bg-surface-secondary/50 border border-border rounded-xl text-text-primary outline-none focus:ring-2 focus:ring-accent/40 transition-all font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-text-secondary/60 mb-1 ml-1">End Date</label>
                        <input 
                          type="text"
                          value={editingExp.endDate}
                          onChange={(e) => setEditingExp({ ...editingExp, endDate: e.target.value })}
                          placeholder="e.g. Present"
                          className="w-full px-4 py-3 bg-surface-secondary/50 border border-border rounded-xl text-text-primary outline-none focus:ring-2 focus:ring-accent/40 transition-all font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-text-secondary/60 mb-1 ml-1">Technologies (csv)</label>
                      <input 
                        type="text"
                        value={editingExp.technologiesStr}
                        onChange={(e) => setEditingExp({ ...editingExp, technologiesStr: e.target.value })}
                        placeholder="Flutter, Dart, Firebase"
                        className="w-full px-4 py-3 bg-surface-secondary/50 border border-border rounded-xl text-text-primary outline-none focus:ring-2 focus:ring-accent/40 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-text-secondary/60 mb-1 ml-1">Description Points</label>
                  <textarea 
                    value={editingExp.descriptionStr}
                    onChange={(e) => setEditingExp({ ...editingExp, descriptionStr: e.target.value })}
                    rows={4}
                    placeholder="Enter each role description on a new line"
                    className="w-full px-4 py-4 bg-surface-secondary/50 border border-border rounded-xl text-text-primary outline-none focus:ring-2 focus:ring-accent/40 transition-all font-medium text-xs leading-relaxed"
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-text-secondary/60 mb-1 ml-1">Key Achievements</label>
                  <textarea 
                    value={editingExp.achievementsStr}
                    onChange={(e) => setEditingExp({ ...editingExp, achievementsStr: e.target.value })}
                    rows={4}
                    placeholder="Enter each achievement on a new line"
                    className="w-full px-4 py-4 bg-surface-secondary/50 border border-border rounded-xl text-text-primary outline-none focus:ring-2 focus:ring-accent/40 transition-all font-medium text-xs leading-relaxed text-accent"
                  />
                </div>
              </div>

              <div className="p-4 border-t border-border bg-surface-secondary/30 flex justify-end gap-3">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 bg-surface hover:bg-surface-secondary text-text-secondary rounded-lg border border-border transition-colors font-bold uppercase text-[10px] tracking-widest"
                >
                  Discard
                </button>
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-8 py-3 bg-accent hover:bg-accent/90 disabled:opacity-50 text-white rounded-xl shadow-xl shadow-accent/10 transition-all font-black uppercase text-[10px] tracking-widest flex items-center gap-2 justify-center"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Saving
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Save Experience
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowDeleteConfirm(null)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-surface border border-border p-8 rounded-[2rem] max-w-sm w-full text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Trash2 size={40} />
              </div>
              <h3 className="text-2xl font-black text-text-primary mb-2">Delete Experience?</h3>
              <p className="text-text-secondary mb-8 text-sm font-medium">This action is permanent and cannot be undone.</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 py-3 bg-surface hover:bg-surface-secondary text-text-secondary border border-border rounded-xl transition-all font-bold uppercase text-[10px] tracking-widest"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl transition-all font-black uppercase text-[10px] tracking-widest shadow-xl shadow-rose-600/20"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
