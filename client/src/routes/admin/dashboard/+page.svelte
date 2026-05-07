<script lang="ts">
  import { auth } from '$lib/auth.svelte';
  import { toast } from '$lib/toast.svelte';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  
  let stats = {
    totalAdmins: 0,
    totalQuotes: 0,
    activeAdmins: 0
  };
  let recentQuotes: any[] = [];
  let loading = true;
  
  onMount(async () => {
    if (!auth.isLoggedIn) {
      goto('/admin/login');
      return;
    }
    
    await loadStats();
  });
  
  async function loadStats() {
    loading = true;
    try {
      const adminsRes = await fetch('/api/admin/admins');
      if (adminsRes.ok) {
        const admins = await adminsRes.json();
        stats.totalAdmins = admins.length;
        stats.activeAdmins = admins.filter((a: any) => a.isActive).length;
      }
      
      const quotesRes = await fetch('/api/admin/quotes');
      if (quotesRes.ok) {
        const quotes = await quotesRes.json();
        stats.totalQuotes = quotes.length;
        recentQuotes = quotes.slice(0, 5);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      loading = false;
    }
  }
  
  function formatCurrency(amount: number) {
    const numericAmount = Number(amount) || 0;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(numericAmount);
  }
  
  function calculateQuoteTotal(quote: any): number {
    let area = quote.sqr_feet;
    if (area === 0 && quote.feet_length > 0 && quote.feet_width > 0) {
      area = quote.feet_width * quote.feet_length;
    }
    
    let total = area * 4;
    
    if (quote.demolition) total += 100;
    if (quote.grout) total += Math.ceil(area / 50) * 4;
    if (quote.pickup) total += 100;
    if (quote.thin_set) total += Math.ceil(area / 70) * 25;
    
    return total;
  }
  
  function getDisplayTotal(quote: any): number {
    if (quote.quote_total && quote.quote_total > 0) {
      return quote.quote_total;
    }
    return calculateQuoteTotal(quote);
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
      <a href="/admin/dashboard" class="nav-item active">
        📊 Dashboard
      </a>
      <a href="/admin/admins" class="nav-item">
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
      <h1>Dashboard</h1>
      <div class="admin-info">
        <span>Welcome, {auth.user?.displayName}</span>
      </div>
    </div>
    
    {#if loading}
      <div class="loading">Loading dashboard...</div>
    {:else}
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-info">
            <h3>Total Admins</h3>
            <p class="stat-number">{stats.totalAdmins}</p>
            <small>{stats.activeAdmins} active</small>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">📋</div>
          <div class="stat-info">
            <h3>Total Quotes</h3>
            <p class="stat-number">{stats.totalQuotes}</p>
            <small>All time</small>
          </div>
        </div>
      </div>
      
      <div class="recent-quotes">
        <h2>Recent Quotes</h2>
        {#if recentQuotes.length > 0}
          <table class="quotes-table">
            <thead>
              <tr>
                <th>Quote ID</th>
                <th>Area (sq ft)</th>
                <th>Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {#each recentQuotes as quote}
                <tr>
                  <td class="quote-id">{quote.quoteId.slice(0, 8)}...}?</td>
                  <td class="area">{quote.sqr_feet || (quote.feet_width * quote.feet_length)}</td>
                  <td class="total">{formatCurrency(getDisplayTotal(quote))}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        {:else}
          <p class="no-data">No quotes yet.</p>
        {/if}
      </div>
    {/if}
  </main>
</div>

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
  
  .admin-info {
    color: #D4DFF5;
  }
  
  /* Stats Grid */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .stat-card {
    background-color: #FDF8F5;
    border-radius: 12px;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    border-left: 5px solid #B3412D;
  }
  
  .stat-icon {
    font-size: 2.5rem;
  }
  
  .stat-info h3 {
    margin: 0 0 0.5rem 0;
    color: #555;
    font-size: 0.9rem;
    text-transform: uppercase;
  }
  
  .stat-number {
    font-size: 2rem;
    font-weight: bold;
    color: #B3412D;
    margin: 0;
  }
  
  .stat-info small {
    color: #888;
  }
  
  /* Recent Quotes */
  .recent-quotes {
    background-color: #FDF8F5;
    border-radius: 12px;
    padding: 1.5rem;
  }
  
  .recent-quotes h2 {
    color: #B3412D;
    margin-bottom: 1rem;
  }
  
  .quotes-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .quotes-table th,
  .quotes-table td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #e0e0e0;
    color: #333;
  }
  
  .quotes-table th {
    background-color: #f5f5f5;
    color: #333;
    font-weight: 600;
  }
  
  .quote-id {
    font-family: monospace;
    color: #555;
  }
  
  .area {
    color: #555;
  }
  
  .total {
    font-weight: bold;
    color: #B3412D;
  }
  
  .loading {
    text-align: center;
    padding: 3rem;
    color: #D4DFF5;
  }
  
  .no-data {
    text-align: center;
    padding: 2rem;
    color: #888;
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
    
    .stats-grid {
      grid-template-columns: 1fr;
    }
    
    .quotes-table {
      font-size: 0.8rem;
    }
  }
</style>