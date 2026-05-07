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
      const createdQuote = await createQuote(quoteData);
      
      sessionStorage.setItem('currentQuoteId', createdQuote.quoteId);
      sessionStorage.setItem('quoteArea', area.toString());
      sessionStorage.setItem('useDimensions', useDimensions.toString());
      if (useDimensions) {
        sessionStorage.setItem('feet_width', feet_width.toString());
        sessionStorage.setItem('feet_length', feet_length.toString());
      }
      
      toast.success('Quote created successfully!');
      
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
    <fieldset class="calculation-fieldset">
      <legend>Area Calculation Method</legend>
      <div class="radio-group">
        <label class="radio-label">
          <input type="radio" bind:group={useDimensions} value={true} />
          <span>Use Dimensions (Length × Width)</span>
        </label>
        <label class="radio-label">
          <input type="radio" bind:group={useDimensions} value={false} />
          <span>Enter Square Feet Directly</span>
        </label>
      </div>
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
        <p class="area-result">Area: <strong class="area-number">{calculatedSqrFeet}</strong> sq ft</p>
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
    
    <fieldset class="services-fieldset">
      <legend>Additional Services</legend>
      <div class="services-grid">
        <label class="checkbox-label">
          <input type="checkbox" bind:checked={demolition} />
          <div class="service-details">
            <strong>Demolition</strong>
            <span class="service-price">$100 flat fee</span>
            <small>Remove existing flooring</small>
          </div>
        </label>
        
        <label class="checkbox-label">
          <input type="checkbox" bind:checked={grout} />
          <div class="service-details">
            <strong>Grout</strong>
            <span class="service-price">$4 per 50 sq ft increment</span>
            <small>Grout application</small>
          </div>
        </label>
        
        <label class="checkbox-label">
          <input type="checkbox" bind:checked={pickup} />
          <div class="service-details">
            <strong>Material Pickup</strong>
            <span class="service-price">$100 flat fee</span>
            <small>Pick up materials from supplier</small>
          </div>
        </label>
        
        <label class="checkbox-label">
          <input type="checkbox" bind:checked={thin_set} />
          <div class="service-details">
            <strong>Thin Set</strong>
            <span class="service-price">$25 per 70 sq ft increment</span>
            <small>Thin set mortar</small>
          </div>
        </label>
      </div>
    </fieldset>
    
    <button type="submit" class="submit-button" disabled={loading}>
      {loading ? 'Creating Quote...' : 'Calculate Quote →'}
    </button>
  </form>
</div>

<style>  
  .container {
    max-width: 800px;
    width: 100%;
    margin: 0 auto;
    padding: 1rem;
    background-color: #2C3E6B;
    min-height: 100vh;
    box-sizing: border-box;
  }
  
  .header {
    margin-bottom: 2rem;
    text-align: center;
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
    font-size: 1.8rem;
  }
  
  .header p {
    color: #D4DFF5;
  }
  
  form {
    margin-top: 2rem;
    width: 100%;
  }
  
  .calculation-fieldset {
    margin: 1.5rem 0;
    padding: 1.5rem;
    padding-top: 1.2rem;
    border: 2px solid #B3412D;
    border-radius: 12px;
    background-color: #FDF8F5;
    width: 100%;
    box-sizing: border-box;
    position: relative;
  }
  
  .services-fieldset {
    margin: 1.5rem 0;
    padding: 1.5rem;
    padding-top: 1.2rem;
    border: 2px solid #B3412D;
    border-radius: 12px;
    background-color: #FDF8F5;
    width: 100%;
    box-sizing: border-box;
    position: relative;
  }
  
  legend {
    font-weight: bold;
    padding: 0 0.75rem;
    font-size: 1.1rem;
    color: #B3412D;
    text-align: center;
    width: auto;
    display: inline-block;
    margin-left: 0.5rem;
  }
  
  .radio-group {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    align-items: center;
    justify-content: center;
    width: 100%;
  }
  
  .radio-label {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.7rem 1.2rem;
    width: 100%;
    cursor: pointer;
    font-size: 1rem;
    color: #1A1A1A;
    border: 1px solid #B3412D;
    border-radius: 8px;
    transition: background-color 0.2s;
    background-color: white;
    box-sizing: border-box;
  }
  
  .radio-label:hover {
    background-color: #FFF0E8;
  }
  
  .radio-label input {
    margin: 0;
    flex-shrink: 0;
  }
  
  .radio-label span {
    flex: 1;
  }
  
  .form-group {
    margin-bottom: 1rem;
    width: 100%;
  }
  
  .form-group label {
    display: block;
    margin: 0.75rem 0;
    color: #FDF8F5;
    font-weight: 500;
  }
  
  .form-group input {
    width: 100%;
    padding: 0.75rem;
    margin-top: 0.25rem;
    border: 2px solid #B3412D;
    border-radius: 8px;
    font-size: 1rem;
    background-color: #FDF8F5;
    box-sizing: border-box;
    color: #1A1A1A;
  }
  
  .form-group input:focus {
    outline: none;
    border-color: #8B2A1A;
  }
  
  .area-result {
    margin-top: 0.5rem;
    padding: 0.75rem;
    background-color: #2C3E6B;
    border-radius: 8px;
    color: #FDF8F5;
    text-align: center;
    font-size: 1rem;
  }
  
  .area-number {
    color: #FDF8F5;
  }
  
  .services-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.8rem;
    width: 100%;
  }
  
  .checkbox-label {
    display: flex;
    align-items: flex-start;
    gap: 0.8rem;
    padding: 1rem;
    border: 2px solid #B3412D;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s;
    background-color: white;
    width: 100%;
    box-sizing: border-box;
  }
  
  .checkbox-label:hover {
    background-color: #FFF0E8;
  }
  
  .checkbox-label input {
    margin-top: 0.2rem;
    transform: scale(1);
    flex-shrink: 0;
  }
  
  .service-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .service-details strong {
    font-size: 0.95rem;
    color: #1A1A1A;
  }
  
  .service-price {
    color: #1A1A1A;
    font-weight: 600;
    font-size: 0.85rem;
  }
  
  .service-details small {
    color: #666;
    font-size: 0.8rem;
    line-height: 1.3;
  }
  
  .submit-button {
    width: 100%;
    padding: 1rem;
    background-color: #B3412D;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 1rem;
    box-sizing: border-box;
  }
  
  .submit-button:hover:not(:disabled) {
    background-color: #8B2A1A;
  }
  
  .submit-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  @media (min-width: 768px) {
    .container {
      padding: 2rem;
    }
    
    .services-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }
  }
  
  @media (max-width: 480px) {
    .calculation-fieldset {
      padding: 1rem;
      padding-top: 0.8rem;
    }
    
    .services-fieldset {
      padding: 1rem;
      padding-top: 0.8rem;
    }
    
    legend {
      font-size: 0.95rem;
      padding: 0 0.5rem;
    }
    
    .radio-label {
      padding: 0.5rem 0.8rem;
      font-size: 0.9rem;
    }
    
    .checkbox-label {
      padding: 0.8rem;
    }
    
    .service-details strong {
      font-size: 0.85rem;
    }
    
    .service-price {
      font-size: 0.8rem;
    }
    
    .service-details small {
      font-size: 0.75rem;
    }
  }
</style>