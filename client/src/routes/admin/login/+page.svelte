<script lang="ts">
  import { auth } from '$lib/auth.svelte';
  import { toast } from '$lib/toast.svelte';
  import { goto } from '$app/navigation';
  
  let email = '';
  let password = '';
  let loading = false;
  
  async function handleLogin() {
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    loading = true;
    
    try {
      const success = await auth.login(email, password);
      if (success) {
        toast.success('Login successful!');
        goto('/admin/dashboard');
      } else {
        toast.error('Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      loading = false;
    }
  }
  
  function goBack() {
    goto('/');
  }
</script>

<div class="container">
  <div class="header">
    <button class="back-button" on:click={goBack}>← Back to Home</button>
    <h1>Admin Login</h1>
  </div>
  
  <div class="login-container">
    <form on:submit|preventDefault={handleLogin}>
      <div class="form-group">
        <label for="email">Email Address</label>
        <input 
          id="email"
          type="email" 
          bind:value={email}
          placeholder="admin@example.com"
          required
          autocomplete="email"
        />
      </div>
      
      <div class="form-group">
        <label for="password">Password</label>
        <input 
          id="password"
          type="password" 
          bind:value={password}
          placeholder="Enter your password"
          required
          autocomplete="current-password"
        />
      </div>
      
      <button type="submit" class="login-button" disabled={loading}>
        {loading ? 'Logging in...' : 'Login →'}
      </button>
    </form>
  </div>
</div>

<style>
  body {
    background-color: #2C3E6B;
  }
  
  .container {
    max-width: 500px;
    margin: 0 auto;
    padding: 2rem;
    background-color: #2C3E6B;
    min-height: 100vh;
    box-sizing: border-box;
  }
  
  .header {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .back-button {
    background: none;
    border: none;
    color: #D4DFF5;
    cursor: pointer;
    font-size: 1rem;
    padding: 0;
    margin-bottom: 1rem;
  }
  
  .back-button:hover {
    color: #B3412D;
    text-decoration: underline;
  }
  
  h1 {
    color: #FDF8F5;
    margin-bottom: 1rem;
    font-size: 2rem;
  }
  
  .login-container {
    background-color: #FDF8F5;
    padding: 2rem;
    border-radius: 12px;
    border: 2px solid #B3412D;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #1A1A1A;
    font-weight: 500;
  }
  
  input {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #B3412D;
    border-radius: 8px;
    font-size: 1rem;
    background-color: white;
    box-sizing: border-box;
  }
  
  input:focus {
    outline: none;
    border-color: #8B2A1A;
  }
  
  .login-button {
    width: 100%;
    padding: 0.75rem;
    background-color: #B3412D;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .login-button:hover:not(:disabled) {
    background-color: #8B2A1A;
    transform: scale(1.02);
  }
  
  .login-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    .container {
      padding: 1rem;
    }
    
    h1 {
      font-size: 1.5rem;
    }
    
    .login-container {
      padding: 1.5rem;
    }
  }
</style>