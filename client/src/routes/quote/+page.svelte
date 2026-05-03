<script lang="ts">
  import { toast } from '$lib/toast.svelte';
  import { goto } from '$app/navigation';
  import { createQuote } from '$lib/quoteService';
  
  let loading = false;
  
  let feet_width = 0;
  let feet_length = 0;
  let sqr_feet = 0;
  let demolition = false;
  let grout = false;
  let pickup = false;
  let thin_set = false;
  
  let useDimensions = true;
  
  $: calculatedSqrFeet = feet_width * feet_length;
  
  async function handleSubmit() {
    loading = true;
    
    let area = useDimensions ? calculatedSqrFeet : sqr_feet;
    
    if (area <= 0) {
      toast.error('Please enter a valid area (greater than 0)');
      loading = false;
      return;
    }
    
    // Prepare data for API
    const quoteData = {
      feet_width: useDimensions ? feet_width : 0,
      feet_length: useDimensions ? feet_length : 0,
      sqr_feet: !useDimensions ? sqr_feet : 0,
      demolition,
      grout,
      pickup,
      thin_set
    };
    
    try {
      // Create quote in backend
      const createdQuote = await createQuote(quoteData);
      
      // Store only the quoteId in sessionStorage
      sessionStorage.setItem('currentQuoteId', createdQuote.quoteId);
      sessionStorage.setItem('quoteArea', area.toString());
      sessionStorage.setItem('useDimensions', useDimensions.toString());
      if (useDimensions) {
        sessionStorage.setItem('feet_width', feet_width.toString());
        sessionStorage.setItem('feet_length', feet_length.toString());
      }
      
      toast.success('Quote created successfully!');
      
      // Navigate to results page with quote ID
      goto(`/quote/${createdQuote.quoteId}/results`);
    } catch (error) {
      console.error('Error creating quote:', error);
      toast.error('Failed to create quote. Please try again.');
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
    <h1>Flooring Quote Calculator</h1>
    <p>Fill out the form below to get an instant estimate for your flooring project</p>
  </div>
  
  <form on:submit|preventDefault={handleSubmit}>
    <fieldset>
      <legend>Area Calculation Method</legend>
      <label>
        <input type="radio" bind:group={useDimensions} value={true} />
        Use Dimensions (Length × Width)
      </label>
      <label>
        <input type="radio" bind:group={useDimensions} value={false} />
        Enter Square Feet Directly
      </label>
    </fieldset>
    
    {#if useDimensions}
      <div class="form-group">
        <label>
          Width (feet)
          <input 
            type="number" 
            min="0" 
            step="0.5"
            bind:value={feet_width}
            required
          />
        </label>
      </div>
      
      <div class="form-group">
        <label>
          Length (feet)
          <input 
            type="number" 
            min="0" 
            step="0.5"
            bind:value={feet_length}
            required
          />
        </label>
      </div>
      
      {#if feet_width > 0 && feet_length > 0}
        <p class="area-result">Area: <strong>{calculatedSqrFeet}</strong> sq ft</p>
      {/if}
    {:else}
      <div class="form-group">
        <label>
          Square Feet
          <input 
            type="number" 
            min="0" 
            step="1"
            bind:value={sqr_feet}
            required
          />
        </label>
      </div>
    {/if}
    
    <fieldset>
      <legend>Additional Services</legend>
      
      <label class="checkbox-label">
        <input type="checkbox" bind:checked={demolition} />
        <div class="service-details">
          <strong>Demolition</strong>
          <span>$100 flat fee</span>
          <small>Remove existing flooring</small>
        </div>
      </label>
      
      <label class="checkbox-label">
        <input type="checkbox" bind:checked={grout} />
        <div class="service-details">
          <strong>Grout</strong>
          <span>$4 per 50 sq ft increment</span>
          <small>Grout application</small>
        </div>
      </label>
      
      <label class="checkbox-label">
        <input type="checkbox" bind:checked={pickup} />
        <div class="service-details">
          <strong>Material Pickup</strong>
          <span>$100 flat fee</span>
          <small>Pick up materials from supplier</small>
        </div>
      </label>
      
      <label class="checkbox-label">
        <input type="checkbox" bind:checked={thin_set} />
        <div class="service-details">
          <strong>Thin Set</strong>
          <span>$25 per 70 sq ft increment</span>
          <small>Thin set mortar</small>
        </div>
      </label>
    </fieldset>
    
    <button type="submit" class="submit-button" disabled={loading}>
      {loading ? 'Creating Quote...' : 'Calculate Quote →'}
    </button>
  </form>
</div>

<style>
  .container {
    max-width: 700px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .header {
    margin-bottom: 2rem;
  }
  
  .back-button {
    background: none;
    border: none;
    color: #007bff;
    cursor: pointer;
    font-size: 1rem;
    padding: 0;
    margin-bottom: 1rem;
  }
  
  .back-button:hover {
    text-decoration: underline;
  }
  
  h1 {
    color: #333;
    margin-bottom: 1rem;
  }
  
  p {
    color: #666;
  }
  
  form {
    margin-top: 2rem;
  }
  
  fieldset {
    margin: 1.5rem 0;
    padding: 1.5rem;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
  }
  
  legend {
    font-weight: bold;
    padding: 0 0.75rem;
    font-size: 1.1rem;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  label {
    display: block;
    margin: 0.75rem 0;
  }
  
  input[type="number"] {
    width: 100%;
    padding: 0.5rem;
    margin-top: 0.25rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
  }
  
  .area-result {
    margin-top: 0.5rem;
    padding: 0.5rem;
    background-color: #e3f2fd;
    border-radius: 4px;
    color: #1976d2;
  }
  
  .checkbox-label {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem;
    margin: 0.5rem 0;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .checkbox-label:hover {
    background-color: #f8f9fa;
  }
  
  .checkbox-label input {
    margin-top: 0.25rem;
  }
  
  .service-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .service-details span {
    color: #007bff;
    font-weight: 500;
  }
  
  .service-details small {
    color: #666;
    font-size: 0.85rem;
  }
  
  .submit-button {
    width: 100%;
    padding: 1rem;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s;
    margin-top: 1rem;
  }
  
  .submit-button:hover:not(:disabled) {
    background-color: #218838;
  }
  
  .submit-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
</style>