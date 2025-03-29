
import React, { useState } from 'react';
import { Edit, Plus, Search, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Note } from '@/lib/types';
import useStore from '@/lib/store';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const NotesList: React.FC = () => {
  const { notes, categories, addNote, updateNote, deleteNote } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newNote, setNewNote] = useState<Partial<Note>>({ title: '', content: '', category: '', tags: [] });
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  
  const handleCreateNote = () => {
    if (newNote.title && newNote.content) {
      addNote({
        title: newNote.title,
        content: newNote.content,
        category: newNote.category,
        tags: newNote.tags,
      });
      setNewNote({ title: '', content: '', category: '', tags: [] });
      setIsCreateDialogOpen(false);
      toast.success('Note created');
    }
  };
  
  const handleUpdateNote = () => {
    if (editingNote) {
      updateNote(editingNote.id, editingNote);
      setEditingNote(null);
      setIsEditDialogOpen(false);
      toast.success('Note updated');
    }
  };
  
  const handleDeleteNote = (id: string) => {
    deleteNote(id);
    toast.success('Note deleted');
  };
  
  const openEditDialog = (note: Note) => {
    setEditingNote({ ...note });
    setIsEditDialogOpen(true);
  };
  
  const filteredNotes = notes
    .filter(note => {
      const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          note.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter ? note.category === categoryFilter : true;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  
  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
        <h2 className="text-2xl font-semibold">Notes</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Note
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 focus-ring"
          />
        </div>
        
        <Select 
          value={categoryFilter || ''} 
          onValueChange={(value) => setCategoryFilter(value || null)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.length === 0 ? (
          <div className="col-span-full text-center p-8">
            <p className="text-muted-foreground">No notes found</p>
          </div>
        ) : (
          filteredNotes.map((note) => (
            <div
              key={note.id}
              className="p-4 rounded-lg border border-border glass card-hover flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{note.title}</h3>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(note)}
                    className="h-8 w-8 rounded-full"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteNote(note.id)}
                    className="h-8 w-8 rounded-full text-destructive"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-3 flex-grow">
                {note.content}
              </p>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {note.category && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {categories.find(c => c.id === note.category)?.name || 'Category'}
                  </span>
                )}
                
                {note.tags && note.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              
              <div className="mt-4 pt-2 border-t border-border text-xs text-muted-foreground">
                Updated {format(new Date(note.updatedAt), 'MMM d, yyyy')}
              </div>
            </div>
          ))
        )}
      </div>
      
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Note</DialogTitle>
            <DialogDescription>
              Add a new note to your collection.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                placeholder="Note title"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Content</label>
              <Textarea
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                placeholder="Write your note here..."
                rows={8}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select
                value={newNote.category || ''}
                onValueChange={(value) => setNewNote({ ...newNote, category: value || undefined })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Tags (comma separated)</label>
              <Input
                value={newNote.tags?.join(', ') || ''}
                onChange={(e) => setNewNote({ 
                  ...newNote, 
                  tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                })}
                placeholder="work, important, idea"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateNote}>Create Note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
            <DialogDescription>
              Make changes to your note.
            </DialogDescription>
          </DialogHeader>
          
          {editingNote && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={editingNote.title}
                  onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Content</label>
                <Textarea
                  value={editingNote.content}
                  onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                  rows={8}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={editingNote.category || ''}
                  onValueChange={(value) => setEditingNote({ ...editingNote, category: value || undefined })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Tags (comma separated)</label>
                <Input
                  value={editingNote.tags?.join(', ') || ''}
                  onChange={(e) => setEditingNote({ 
                    ...editingNote, 
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                  })}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateNote}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotesList;
