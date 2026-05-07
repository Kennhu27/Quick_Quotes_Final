<script lang="ts">
  import { auth } from '$lib/auth.svelte';
  import { toast } from '$lib/toast.svelte';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  
  let admins: any[] = [];
  let loading = true;
  let showCreateModal = false;
  
  let newAdmin = {
    email: '',
    password: '',
    fullName: ''
  };
  let creating = false;
  
  onMount(async () => {
    if (!auth.isLoggedIn) {
      goto('/admin/login');
      return;
    }
    await loadAdmins();
  });
  
  async function loadAdmins() {
    loading = true;
    try {
      const res = await fetch('/api/admin/admins');
      if (res.ok) {
        admins = await res.json();
      } else {
        toast.error('Failed to load admins');
      }
    } catch (error) {
      console.error('Error loading admins:', error);
      toast.error('Failed to load admins');
    } finally {
      loading = false;
    }
  }
  
  async function toggleAdminStatus(adminId: string, currentStatus: boolean) {
    try {
      const res = await fetch(`/api/admin/admins/${adminId}/toggle-status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (res.ok) {
        toast.success(`Admin ${currentStatus ? 'disabled' : 'enabled'} successfully`);
        await loadAdmins();
      } else {
        const error = await res.json();
        toast.error(error.error || 'Failed to update admin status');
      }
    } catch (error) {
      console.error('Error updating admin:', error);
      toast.error('Failed to update admin status');
    }
  }
  
  async function deleteAdmin(adminId: string, adminName: string) {
    if (confirm(`Are you sure you want to delete ${adminName}? This action cannot be undone.`)) {
      try {
        const res = await fetch(`/api/admin/admins/${adminId}`, {
          method: 'DELETE'
        });
        
        if (res.ok) {
          toast.success('Admin deleted successfully');
          await loadAdmins();
        } else {
          const error = await res.json();
          toast.error(error.error || 'Failed to delete admin');
        }
      } catch (error) {
        console.error('Error deleting admin:', error);
        toast.error('Failed to delete admin');
      }
    }
  }
  
  async function createAdmin() {
    if (!newAdmin.email || !newAdmin.password || !newAdmin.fullName) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (newAdmin.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    
    creating = true;
    try {
      const res = await fetch('/api/admin/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAdmin)
      });
      
      if (res.ok) {
        toast.success('Admin created successfully');
        showCreateModal = false;
        newAdmin = { email: '', password: '', fullName: '' };
        await loadAdmins();
      } else {
        const error = await res.json();
        toast.error(error.error || 'Failed to create admin');
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      toast.error('Failed to create admin');
    } finally {
      creating = false;
    }
  }
  
  function logout() {
    auth.logout();
  }
</script>

<div class="dashboard-container">
  <aside class="sidebar">
    <div class="sidebar-header">
      <h2>Admin Panel</h2>
    </div>
    <nav class="sidebar-nav">
      <a href="/admin/dashboard" class="nav-item">
        📊 Dashboard
      </a>
      <a href="/admin/admins" class="nav-item active">
        👥 Manage Admins
      </a>
      <a href="/admin/quotes" class="nav-item">
        📄 View Quotes
      </a>
      <button on:click={logout} class="nav-item logout">
        🚪 Logout
      </button>
    </nav>
  </aside>
  
  <main class="main-content">
    <div class="top-bar">
      <h1>Manage Admins</h1>
      <button class="create-btn" on:click={() => showCreateModal = true}>
        + Create New Admin
      </button>
    </div>
    
    {#if loading}
      <div class="loading">Loading admins...</div>
    {:else}
      <div class="admins-table-container">
        <table class="admins-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {#each admins as admin}
              <tr>
                <td>{admin.fullName}</td>
                <td>{admin.email}</td>
                <td class="status-cell">
                  <span class={`status-badge ${admin.isActive ? 'active' : 'inactive'}`}>
                    {admin.isActive ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td class="date-cell">
                  {admin.lastLoginAt ? new Date(admin.lastLoginAt).toLocaleDateString() : 'Never'}
                </td>
                <td class="date-cell">{new Date(admin.createdAt).toLocaleDateString()}</td>
                <td class="actions">
                  <button 
                    class="toggle-btn"
                    on:click={() => toggleAdminStatus(admin.adminId, admin.isActive)}
                  >
                    {admin.isActive ? 'Disable' : 'Enable'}
                  </button>
                  <button 
                    class="delete-btn"
                    on:click={() => deleteAdmin(admin.adminId, admin.fullName)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </main>
</div>

{#if showCreateModal}
  <div class="modal-overlay" on:click={() => showCreateModal = false}>
    <div class="modal" on:click={(e) => e.stopPropagation()}>
      <div class="modal-header">
        <h2>Create New Admin</h2>
        <button class="close-btn" on:click={() => showCreateModal = false}>×</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label>Full Name</label>
          <input type="text" bind:value={newAdmin.fullName} placeholder="John Doe" />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" bind:value={newAdmin.email} placeholder="admin@example.com" />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" bind:value={newAdmin.password} placeholder="Min 8 characters" />
        </div>
      </div>
      <div class="modal-footer">
        <button class="cancel-btn" on:click={() => showCreateModal = false}>Cancel</button>
        <button class="create-btn" on:click={createAdmin} disabled={creating}>
          {creating ? 'Creating...' : 'Create Admin'}
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .dashboard-container {
    display: flex;
    min-height: 100vh;
    background-color: #2C3E6B;
  }
  
  /* Sidebar */
  .sidebar {
    width: 260px;
    background: linear-gradient(135deg, #2A1B38 0%, #4A2C1B 100%);
    color: white;
    display: flex;
    flex-direction: column;
  }
  
  .sidebar-header {
    padding: 1.5rem;
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }
  
  .sidebar-header h2 {
    margin: 0;
    font-size: 1.3rem;
    color: #FDF8F5;
  }
  
  .sidebar-nav {
    flex: 1;
    padding: 1rem 0;
  }
  
  .nav-item {
    display: block;
    padding: 0.75rem 1.5rem;
    color: #D4DFF5;
    text-decoration: none;
    transition: all 0.3s ease;
    cursor: pointer;
    border: none;
    background: none;
    width: 100%;
    text-align: left;
    font-size: 1rem;
  }
  
  .nav-item:hover {
    background-color: rgba(255,255,255,0.1);
    color: white;
  }
  
  .nav-item.active {
    background-color: #B3412D;
    color: white;
  }
  
  .nav-item.logout {
    margin-top: 2rem;
    color: #ff6b6b;
  }
  
  .nav-item.logout:hover {
    background-color: rgba(255,107,107,0.1);
  }
  
  /* Main Content */
  .main-content {
    flex: 1;
    padding: 2rem;
  }
  
  .top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }
  
  .top-bar h1 {
    color: #FDF8F5;
    margin: 0;
  }
  
  .create-btn {
    background-color: #B3412D;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
  }
  
  .create-btn:hover {
    background-color: #8B2A1A;
  }
  
  /* Admins Table */
  .admins-table-container {
    background-color: #FDF8F5;
    border-radius: 12px;
    overflow-x: auto;
  }
  
  .admins-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .admins-table th,
  .admins-table td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #e0e0e0;
  }
  
  .admins-table th {
    background-color: #f5f5f5;
    color: #333;
    font-weight: 600;
  }
  
  .admins-table td {
    color: #444;
  }
  
  .status-cell {
    color: #444;
  }
  
  .date-cell {
    color: #666;
  }
  
  .status-badge {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
  }
  
  .status-badge.active {
    background-color: #28a745;
    color: white;
  }
  
  .status-badge.inactive {
    background-color: #dc3545;
    color: white;
  }
  
  .actions {
    display: flex;
    gap: 0.5rem;
  }
  
  .toggle-btn {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.8rem;
  }
  
  .toggle-btn:hover {
    background-color: #0056b3;
  }
  
  .delete-btn {
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.8rem;
  }
  
  .delete-btn:hover {
    background-color: #c82333;
  }
  
  /* Modal */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal {
    background-color: #FDF8F5;
    border-radius: 12px;
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #e0e0e0;
  }
  
  .modal-header h2 {
    margin: 0;
    color: #B3412D;
  }
  
  .close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #666;
  }
  
  .close-btn:hover {
    color: #333;
  }
  
  .modal-body {
    padding: 1.5rem;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: #333;
    font-weight: 500;
  }
  
  .form-group input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
    color: #333;
  }
  
  .form-group input:focus {
    outline: none;
    border-color: #B3412D;
  }
  
  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    padding: 1rem 1.5rem;
    border-top: 1px solid #e0e0e0;
  }
  
  .cancel-btn {
    background-color: #6c757d;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .cancel-btn:hover {
    background-color: #5a6268;
  }
  
  .loading {
    text-align: center;
    padding: 3rem;
    color: #D4DFF5;
  }
  
  @media (max-width: 768px) {
    .dashboard-container {
      flex-direction: column;
    }
    
    .sidebar {
      width: 100%;
    }
    
    .sidebar-nav {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      padding: 1rem;
    }
    
    .nav-item {
      flex: 1;
      text-align: center;
      padding: 0.5rem;
      border-radius: 8px;
    }
    
    .admins-table {
      font-size: 0.8rem;
    }
    
    .actions {
      flex-direction: column;
      gap: 0.25rem;
    }
    
    .toggle-btn, .delete-btn {
      width: 100%;
    }
  }
</style>