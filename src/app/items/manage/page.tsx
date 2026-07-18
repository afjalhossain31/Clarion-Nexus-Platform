'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth, API_URL } from '../../../context/AuthContext';
import { Eye, Trash2, FolderKanban, AlertCircle, Loader, Calendar, DollarSign, X, CheckCircle2, ChevronDown, User } from 'lucide-react';

interface ProjectRequest {
  _id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  budget: number;
  imageUrl?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'rejected';
  createdAt: string;
  user: string | { _id: string; name: string; email: string; avatarUrl?: string };
}

export default function ManageRequestsPage() {
  const { isAuthenticated, isLoading, token, user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Detail Modal inspection state
  const [inspectedProject, setInspectedProject] = useState<ProjectRequest | null>(null);

  // Guard redirection
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Fetch Requests List
  const { data: requests, isLoading: loadingList, isError } = useQuery<ProjectRequest[]>({
    queryKey: ['userRequests', token],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/requests`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to load project requests');
      return res.json();
    },
    enabled: !!token
  });

  // Delete Request Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API_URL}/requests/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to delete request');
      }
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['userRequests'] });
      if (inspectedProject?._id === id) {
        setInspectedProject(null);
      }
    },
    onError: (err: any) => {
      alert(err.message || 'Error deleting project request.');
    }
  });

  // Approve / Update Status Mutation (Admin only)
  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch(`${API_URL}/requests/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to update status');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userRequests'] });
    },
    onError: (err: any) => {
      alert(err.message || 'Error updating status.');
    }
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-app-fg/60 gap-2">
        <Loader className="h-5 w-5 animate-spin text-brand-blue" />
        <span className="text-sm font-medium">Checking session...</span>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-500 border-green-500/25';
      case 'in-progress':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/25';
      case 'rejected':
        return 'bg-red-500/10 text-red-500 border-red-500/25';
      default:
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/25';
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete and cancel this project request?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="flex flex-col gap-2 mb-10 text-left">
        <h1 className="font-display text-3xl font-extrabold text-app-fg tracking-tight sm:text-4xl">
          {user?.role === 'admin' ? 'All Client Project Requests' : 'Manage Custom Projects'}
        </h1>
        <p className="text-sm text-app-fg/60">
          {user?.role === 'admin' 
            ? 'Administrator View: track pipeline estimates, approve client request details, or delete completed tasks.' 
            : 'Track status stages, review scope parameters, or delete custom digital scope listings.'}
        </p>
      </div>

      {/* Main Content */}
      {loadingList ? (
        <div className="flex min-h-[30vh] items-center justify-center text-app-fg/50 gap-2">
          <Loader className="h-5 w-5 animate-spin text-brand-blue" />
          <span className="text-xs">Loading requests pipeline...</span>
        </div>
      ) : isError ? (
        <div className="text-center py-16 border border-card-border/60 rounded-2xl bg-card-bg">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 font-semibold mb-2">Error loading dashboard</p>
          <p className="text-xs text-app-fg/60">Could not retrieve project request data from server.</p>
        </div>
      ) : !requests || requests.length === 0 ? (
        <div className="text-center py-20 border border-card-border/60 rounded-2xl bg-card-bg flex flex-col items-center">
          <FolderKanban className="h-12 w-12 text-app-fg/30 mb-4" />
          <h3 className="font-display font-bold text-app-fg text-base mb-1">No custom project requests</h3>
          <p className="text-xs text-app-fg/60 mb-6">Create your first custom request layout to populate this pipeline dashboard.</p>
          <button
            onClick={() => router.push('/items/add')}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-brand-blue to-brand-purple hover:scale-105 active:scale-95 transition cursor-pointer"
          >
            Create Request
          </button>
        </div>
      ) : (
        // Responsive Requests List
        <div className="overflow-x-auto rounded-2xl border border-card-border bg-card-bg/60 backdrop-blur-xs">
          <table className="min-w-full divide-y divide-card-border text-left">
            <thead className="bg-card-border/20 text-xs font-bold uppercase tracking-wider text-app-fg/70">
              <tr>
                {user?.role === 'admin' && <th className="px-6 py-4">Client</th>}
                <th className="px-6 py-4">Project Scope</th>
                <th className="px-6 py-4">Submitted On</th>
                <th className="px-6 py-4">Budget</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border bg-transparent text-sm text-app-fg/90">
              {requests.map((req) => {
                const requester = typeof req.user === 'object' ? req.user : null;
                return (
                  <tr key={req._id} className="hover:bg-card-border/10 transition-colors">
                    {/* Admin Client Info */}
                    {user?.role === 'admin' && (
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {requester?.avatarUrl ? (
                            <img 
                              src={requester.avatarUrl} 
                              alt="Avatar" 
                              className="h-7 w-7 rounded-full bg-app-bg object-cover"
                            />
                          ) : (
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
                              <User className="h-3.5 w-3.5" />
                            </div>
                          )}
                          <div className="flex flex-col text-left">
                            <span className="text-xs font-semibold">{requester?.name || 'Client'}</span>
                            <span className="text-[10px] text-app-fg/50">{requester?.email || 'Unknown'}</span>
                          </div>
                        </div>
                      </td>
                    )}
                    
                    {/* Project Title & Short Desc */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col max-w-xs sm:max-w-sm">
                        <span className="font-bold text-app-fg text-sm truncate">{req.title}</span>
                        <span className="text-xs text-app-fg/60 truncate">{req.shortDesc}</span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-xs font-medium text-app-fg/75">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-app-fg/40" />
                        <span>{formatDate(req.createdAt)}</span>
                      </div>
                    </td>

                    {/* Budget */}
                    <td className="px-6 py-4 font-semibold text-brand-blue">
                      <div className="flex items-center text-xs">
                        <DollarSign className="h-3.5 w-3.5 -mr-0.5" />
                        <span>{req.budget.toLocaleString()}</span>
                      </div>
                    </td>

                    {/* Status badge pill */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusBadge(req.status)}`}>
                        {req.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* Admin: Status quick-change */}
                        {user?.role === 'admin' && (
                          <div className="relative group">
                            <select
                              value={req.status}
                              onChange={(e) => statusMutation.mutate({ id: req._id, status: e.target.value })}
                              disabled={statusMutation.isPending}
                              className={`appearance-none pl-2.5 pr-7 py-1.5 rounded-lg text-[10px] font-bold uppercase border cursor-pointer transition-all duration-200 focus:outline-none
                                ${req.status === 'completed' ? 'bg-green-500/10 text-green-400 border-green-500/25 hover:bg-green-500/20' :
                                  req.status === 'in-progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/25 hover:bg-blue-500/20' :
                                  req.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/25 hover:bg-red-500/20' :
                                  'bg-yellow-500/10 text-yellow-400 border-yellow-500/25 hover:bg-yellow-500/20'}
                                bg-app-bg`}
                              title="Change status"
                            >
                              <option value="pending">Pending</option>
                              <option value="in-progress">In Progress</option>
                              <option value="completed">Completed</option>
                              <option value="rejected">Rejected</option>
                            </select>
                            <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 pointer-events-none text-app-fg/40" />
                          </div>
                        )}

                        <button
                          onClick={() => setInspectedProject(req)}
                          className="p-2 rounded-lg text-app-fg/65 hover:text-brand-blue hover:bg-brand-blue/10 transition"
                          title="View Full Scope"
                        >
                          <Eye className="h-4.5 w-4.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(req._id)}
                          className="p-2 rounded-lg text-app-fg/65 hover:text-red-500 hover:bg-red-500/10 transition"
                          title="Delete Request"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* View Requirements details Modal overlay */}
      {inspectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          
          <div className="w-full max-w-2xl rounded-2xl border border-card-border bg-card-bg p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 duration-200 text-left">
            
            <button
              onClick={() => setInspectedProject(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-app-fg/60 hover:bg-card-border/50 hover:text-app-fg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal content */}
            <div className="flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[9px] font-extrabold uppercase border w-fit mb-4 select-none bg-app-bg text-app-fg/60 border-card-border">
              Scope Details Inspection
            </div>

            <h2 className="font-display text-xl sm:text-2xl font-extrabold text-app-fg mb-4 pr-8">
              {inspectedProject.title}
            </h2>

            {/* Meta tags */}
            <div className="flex flex-wrap gap-4 text-xs font-semibold text-app-fg/70 mb-6 border-b border-card-border/40 pb-4">
              <div className="flex items-center gap-1">
                <span className="text-app-fg/40">Status:</span>
                <span className={`px-2 py-0.5 rounded uppercase text-[9px] border ${getStatusBadge(inspectedProject.status)}`}>
                  {inspectedProject.status}
                </span>
              </div>
              <div>
                <span className="text-app-fg/40">Budget:</span>{' '}
                <span className="text-brand-blue">${inspectedProject.budget.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-app-fg/40">Submitted:</span>{' '}
                <span>{formatDate(inspectedProject.createdAt)}</span>
              </div>
            </div>

            {/* Descriptions container */}
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              <div>
                <h4 className="text-[10px] uppercase font-bold text-app-fg/50 tracking-wider mb-1">
                  Summary Abstract
                </h4>
                <p className="text-xs text-app-fg/80 leading-relaxed font-semibold">
                  {inspectedProject.shortDesc}
                </p>
              </div>

              <div>
                <h4 className="text-[10px] uppercase font-bold text-app-fg/50 tracking-wider mb-1">
                  Scope of Requirements
                </h4>
                <p className="text-xs text-app-fg/70 leading-relaxed whitespace-pre-wrap">
                  {inspectedProject.fullDesc}
                </p>
              </div>
            </div>

            {/* Close CTA */}
            <div className="mt-8 pt-4 border-t border-card-border/40 flex justify-end">
              <button
                onClick={() => setInspectedProject(null)}
                className="px-5 py-2 rounded-xl text-xs font-semibold border border-card-border bg-card-bg/40 text-app-fg hover:bg-card-border/60 transition cursor-pointer"
              >
                Close View
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
