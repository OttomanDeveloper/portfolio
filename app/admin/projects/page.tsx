'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Filter, Edit2, Trash2, X, Github, ExternalLink, Loader2, Save } from 'lucide-react'
import { getProjects } from '@/lib/api'
import { adminSaveProject, adminDeleteProject } from '../actions'

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editingProject, setEditingProject] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    setIsLoading(true)
    try {
      const data = await getProjects()
      setProjects(data)
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (project: any) => {
    setEditingProject({ 
        ...project,
        languagesStr: project.languages?.join(', ') || '',
        platformsStr: project.platforms?.join(', ') || '',
        bulletsStr: project.bullets?.join('\n') || '',
        statsStr: JSON.stringify(project.stats || [], null, 2)
    })
    setIsEditing(true)
  }

  const handleAddNew = () => {
    setEditingProject({
      id: `new-${Date.now()}`,
      name: '',
      description: '',
      fullDescription: '',
      githubUrl: '',
      liveUrl: '',
      vibrantColor: '#818cf8',
      languagesStr: '',
      platformsStr: '',
      bulletsStr: '',
      statsStr: '[]'
    })
    setIsEditing(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await adminDeleteProject(id)
      if (error) throw new Error(error)
      setProjects(projects.filter(p => p.id !== id))
      setShowDeleteConfirm(null)
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Failed to delete project')
    }
  }

  const handleSave = async () => {
    if (!editingProject) return
    if (!editingProject.name?.trim() || !editingProject.description?.trim()) {
      alert('Project Name and Short Description are mandatory fields.')
      return
    }
    setIsSaving(true)
    try {
      let parsedStats = []
      try { parsedStats = JSON.parse(editingProject.statsStr || '[]') } catch(e) {}
      
      const { 
        languagesStr,
        platformsStr,
        bulletsStr,
        statsStr,
        ...projectDataWithoutStrings
      } = editingProject;

      const payload = {
          ...projectDataWithoutStrings,
          languages: editingProject.languagesStr?.split(',').map((s: string) => s.trim()).filter(Boolean) || [],
          platforms: editingProject.platformsStr?.split(',').map((s: string) => s.trim()).filter(Boolean) || [],
          bullets: editingProject.bulletsStr?.split('\n').filter(Boolean) || [],
          stats: parsedStats
      }

      const { data, error } = await adminSaveProject(payload)
      if (error) throw new Error(error)
      
      await fetchProjects()
      setIsEditing(false)
      setEditingProject(null)
    } catch (error) {
      console.error('Error saving project:', error)
      alert('Failed to save project')
    } finally {
      setIsSaving(false)
    }
  }

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Project Management</h1>
          <p className="text-text-secondary">Manage your portfolio projects and case studies</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-accent hover:bg-accent/80 text-white rounded-lg transition-colors whitespace-nowrap font-bold"
        >
          <Plus size={20} />
          Add New Project
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
          <input 
            type="text"
            placeholder="Search projects by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all shadow-sm"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-indigo-500" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-surface/50 border border-border rounded-2xl overflow-hidden hover:border-accent/40 transition-all p-5 flex flex-col sm:flex-row gap-5 group shadow-sm hover:shadow-md"
              >
                <div 
                  className="w-full sm:w-40 h-32 rounded-xl shrink-0 flex items-center justify-center relative overflow-hidden"
                  style={{ backgroundColor: `${project.vibrantColor}10`, border: `1px solid ${project.vibrantColor}30` }}
                >
                  <div className="absolute inset-0 blur-3xl opacity-10" style={{ backgroundColor: project.vibrantColor }} />
                  <span className="text-3xl font-black relative z-10" style={{ color: project.vibrantColor }}>
                    {project.name.charAt(0)}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0 py-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xl font-bold text-text-primary truncate">{project.name}</h3>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleEdit(project)}
                        className="p-2 text-text-secondary hover:text-accent hover:bg-accent/10 rounded-lg transition-all"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => setShowDeleteConfirm(project.id)}
                        className="p-2 text-text-secondary hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-text-secondary line-clamp-2 mt-1 font-medium">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 bg-accent/5 text-accent rounded-md border border-accent/10">
                      {project.platforms?.[0] || 'Web'}
                    </span>
                    {project.languages?.slice(0, 4).map((lang: string) => (
                      <span key={lang} className="text-[9px] font-bold px-2 py-0.5 bg-surface text-text-secondary rounded-md border border-border">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Editor Modal */}
      <AnimatePresence>
        {isEditing && editingProject && (
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
                  {editingProject.id.toString().startsWith('new-') ? 'Add New Project' : 'Edit Project'}
                </h2>
                <button onClick={() => setIsEditing(false)} className="text-text-secondary hover:text-text-primary transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-text-secondary/60 mb-1 ml-1">Project Name</label>
                      <input 
                        type="text"
                        value={editingProject.name}
                        onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                        className="w-full px-4 py-3 bg-surface-secondary/50 border border-border rounded-xl text-text-primary focus:ring-2 focus:ring-accent/40 outline-none transition-all font-bold"
                        placeholder="e.g. Finance Hub"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-text-secondary/60 mb-1 ml-1">Short Description</label>
                      <input 
                        type="text"
                        value={editingProject.description}
                        onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                        className="w-full px-4 py-3 bg-surface-secondary/50 border border-border rounded-xl text-text-primary focus:ring-2 focus:ring-accent/40 outline-none transition-all font-medium"
                        placeholder="One-liner about the project"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-text-secondary/60 mb-1 ml-1">Accent Color</label>
                      <div className="flex gap-3">
                        <input 
                          type="color"
                          value={editingProject.vibrantColor}
                          onChange={(e) => setEditingProject({ ...editingProject, vibrantColor: e.target.value })}
                          className="w-12 h-12 bg-transparent rounded-xl cursor-pointer border border-border overflow-hidden"
                        />
                        <input 
                          type="text"
                          value={editingProject.vibrantColor}
                          onChange={(e) => setEditingProject({ ...editingProject, vibrantColor: e.target.value })}
                          className="flex-1 px-4 py-3 bg-surface-secondary/50 border border-border rounded-xl text-text-primary focus:ring-2 focus:ring-accent/40 outline-none font-mono text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-text-secondary/60 mb-1 ml-1">GitHub URL</label>
                      <input 
                        type="text"
                        value={editingProject.githubUrl}
                        onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                        className="w-full px-4 py-3 bg-surface-secondary/50 border border-border rounded-xl text-text-primary focus:ring-2 focus:ring-accent/40 outline-none transition-all"
                        placeholder="https://github.com/..."
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-text-secondary/60 mb-1 ml-1">Live URL</label>
                      <input 
                        type="text"
                        value={editingProject.liveUrl || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                        className="w-full px-4 py-3 bg-surface-secondary/50 border border-border rounded-xl text-text-primary focus:ring-2 focus:ring-accent/40 outline-none transition-all"
                        placeholder="https://yourapp.link"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-text-secondary/60 mb-1 ml-1">Languages (csv)</label>
                        <input 
                          type="text"
                          value={editingProject.languagesStr}
                          onChange={(e) => setEditingProject({ ...editingProject, languagesStr: e.target.value })}
                          className="w-full px-4 py-3 bg-surface-secondary/50 border border-border rounded-xl text-text-primary focus:ring-2 focus:ring-accent/40 outline-none"
                          placeholder="React, Tw..."
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-text-secondary/60 mb-1 ml-1">Platforms (csv)</label>
                        <input 
                          type="text"
                          value={editingProject.platformsStr}
                          onChange={(e) => setEditingProject({ ...editingProject, platformsStr: e.target.value })}
                          className="w-full px-4 py-3 bg-surface-secondary/50 border border-border rounded-xl text-text-primary focus:ring-2 focus:ring-accent/40 outline-none"
                          placeholder="Web, iOS..."
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-text-secondary/60 mb-1 ml-1">Case Study (Markdown)</label>
                  <textarea 
                    value={editingProject.fullDescription}
                    onChange={(e) => setEditingProject({ ...editingProject, fullDescription: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-4 bg-surface-secondary/50 border border-border rounded-xl text-text-primary focus:ring-2 focus:ring-accent/40 outline-none font-mono text-xs leading-relaxed"
                    placeholder="# Strategic Implementation..."
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-text-secondary/60 mb-1 ml-1">Bullets / Highlights</label>
                        <textarea 
                            value={editingProject.bulletsStr}
                            onChange={(e) => setEditingProject({ ...editingProject, bulletsStr: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-4 bg-surface-secondary/50 border border-border rounded-xl text-text-primary focus:ring-2 focus:ring-accent/40 outline-none font-medium text-xs whitespace-pre-wrap"
                            placeholder="Enter each point on a new line"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-text-secondary/60 mb-1 ml-1">Stats JSON</label>
                        <textarea 
                            value={editingProject.statsStr}
                            onChange={(e) => setEditingProject({ ...editingProject, statsStr: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-4 bg-surface-secondary/50 border border-border rounded-xl text-text-primary focus:ring-2 focus:ring-accent/40 outline-none font-mono text-[10px] whitespace-pre-wrap"
                        />
                    </div>
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
                      Save Project
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
              <h3 className="text-2xl font-black text-text-primary mb-2">Delete Project?</h3>
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
