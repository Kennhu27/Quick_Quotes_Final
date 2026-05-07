<script lang="ts">
  import { auth } from '$lib/auth.svelte';
  import { toast } from '$lib/toast.svelte';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  
  let quotes: any[] = [];
  let loading = true;
  let filter = 'all'; // all, with-services, without-services
  
  onMount(async () => {
    if (!auth.isLoggedIn) {
      goto('/admin/login');
      return;
    }
    await loadQuotes();
  });
  
  async function loadQuotes() {
    loading = true;
    try {
      const res = await fetch('/api/admin/quotes');
      if (res.ok) {
        quotes = await res.json();
      } else {
        toast.error('Failed to load quotes');
      }
    } catch (error) {
      console.error('Error loading quotes:', error);
      toast.error('Failed to load quotes');
    } finally {
      loading = false;
    }
  }
  
  function hasServices(quote: any) {
    return quote.demolition || quote.grout || quote.pickup || quote.thin_set;
  }
  
  function getFilteredQuotes() {
    if (filter === 'with-services') {
      return quotes.filter(q => hasServices(q));
    } else if (filter === 'without-services') {
      return quotes.filter(q => !hasServices(q));
    }
    return quotes;
  }
  
  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
  
  function logout() {
    auth.logout();
  }
</script>

<div class="dashboard-container">
  <!-- Sidebar -->
  <aside class="sidebar">
    <div class="sidebar-header">
      <h2>Admin Panel</h2>
    </div>
    <nav class="sidebar-nav">
      <a href="/admin/dashboard" class="nav-item">
        📊 Dashboard
      </a>
      <a href="/admin/admins" class="nav-item">
        👥 Manage Admins
      </a>
      <a href="/admin/quotes" class="nav-item active">
        📄 View Quotes
      </a>
      <button on:click={logout} class="nav-item logout">
        🚪 Logout
      </button>
    </nav>
  </aside>
  
  <!-- Main Content -->
  <main class="main-content">
    <div class="top-bar">
      <h1>All Quotes</h1>
      <div class="filter-buttons">
        <button 
          class={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          on:click={() => filter = 'all'}
        >
          All
        </button>
        <button 
          class={`filter-btn ${filter === 'with-services' ? 'active' : ''}`}
          on:click={() => filter = 'with-services'}
        >
          With Services
        </button>
        <button 
          class={`filter-btn ${filter === 'without-services' ? 'active' : ''}`}
          on:click={() => filter = 'without-services'}
        >
          Base Only
        </button>
      </div>
    </div>
    
    {#if loading}
      <div class="loading">Loading quotes...</div>
    {:else}
      <div class="quotes-table-container">
        <table class="quotes-table">
          <thead>
            <tr>
              <th>Quote ID</th>
              <th>Area (sq ft)</th>
              <th>Demolition</th>
              <th>Grout</th>
              <th>Pickup</th>
              <th>Thin Set</th>
              <th>Total Cost</th>
            </tr>
          </thead>
          <tbody>
            {#each getFilteredQuotes() as quote}
              <tr class="quote-row">
                <td class="quote-id">{quote.quoteId}</td>
                <td>{quote.sqr_feet || (quote.feet_width * quote.feet_length)}</td>
                <td class="service-cell">{quote.demolition ? '✓' : '✗'}</td>
                <td class="service-cell">{quote.grout ? '✓' : '✗'}</td>
                <td class="service-cell">{quote.pickup ? '✓' : '✗'}</td>
                <td class="service-cell">{quote.thin_set ? '✓' : '✗'}</td>
                <td class="total">{formatCurrency(quote.quote_total)}</td>
              </tr>
            {:else}
              <tr>
                <td colspan="7" class="no-data">No quotes found</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
      
      <div class="stats-footer">
        <p>Total Quotes: <strong>{getFilteredQuotes().length}</strong></p>
        <p>Total Revenue: <strong>{formatCurrency(getFilteredQuotes().reduce((sum, q) => sum + q.quote_total, 0))}</strong></p>
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
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .top-bar h1 {
    color: #FDF8F5;
    margin: 0;
  }
  
  .filter-buttons {
    display: flex;
    gap: 0.5rem;
  }
  
  .filter-btn {
    background-color: #FDF8F5;
    border: 1px solid #B3412D;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    color: #333;
  }
  
  .filter-btn.active {
    background-color: #B3412D;
    color: white;
  }
  
  .filter-btn:hover:not(.active) {
    background-color: #FFF0E8;
  }
  
  /* Quotes Table */
  .quotes-table-container {
    background-color: #FDF8F5;
    border-radius: 12px;
    overflow-x: auto;
  }
  
  .quotes-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .quotes-table th,
  .quotes-table td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #e0e0e0;
  }
  
  .quotes-table th {
    background-color: #f5f5f5;
    color: #333;
    font-weight: 600;
  }
  
  .quotes-table td {
    color: #444;
  }
  
  .quote-id {
    font-family: monospace;
    font-size: 0.85rem;
    color: #555;
  }
  
  .service-cell {
    text-align: center;
    color: #555;
  }
  
  .total {
    font-weight: bold;
    color: #B3412D;
  }
  
  .no-data {
    text-align: center;
    padding: 2rem;
    color: #888;
  }
  
  .stats-footer {
    margin-top: 1.5rem;
    padding: 1rem;
    background-color: #FDF8F5;
    border-radius: 12px;
    display: flex;
    justify-content: space-between;
    font-size: 1.1rem;
  }
  
  .stats-footer p {
    margin: 0;
    color: #333;
  }
  
  .stats-footer strong {
    color: #B3412D;
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
    
    .top-bar {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .quotes-table {
      font-size: 0.8rem;
    }
    
    .quotes-table th,
    .quotes-table td {
      padding: 0.5rem;
    }
    
    .stats-footer {
      flex-direction: column;
      text-align: center;
      gap: 0.5rem;
    }
  }
</style>