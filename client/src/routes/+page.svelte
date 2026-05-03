<script lang="ts">
  import { auth } from '$lib/auth.svelte';
  import { toast } from '$lib/toast.svelte';
  import { goto } from '$app/navigation';
</script>

<div class="hero">
  <div class="logo-container">
    <img src="/logo/logo.jpg" alt="Hernandez Flooring LLC Logo" class="logo" />
  </div>
  
  <h1>Welcome to Hernandez Flooring LLC</h1>
</div>

<section class="about-section">
  <h2>What does Hernandez Flooring do?</h2>
  <div class="about-content">
    <p>
      Hernandez Flooring LLC is a local small bussiness where we focus 
      on placeing down floor tiles of any kind from indoor to outdoor.
      Not only that we do even more!
    </p>
    <p>
      We also do bathroom remodling, backsplashes and etc. We are
      located locally in Jonesboro, AR and willing to travel certian
      distance to do the job. We are down to visit the site and give you 
      a quick quote on how long and how much the job is going to cost.
    </p>
    <p>
    Remember we don't charge for inspections, for the best quality and the 
    right price!
    </p>
  </div>
</section>

<section class="gallery-section">
  <h2>Take a look at some of our previous jobs</h2>
  <div class="gallery">
    <div class="gallery-item">
      <img src="/gallery/project1.jpg" alt="Previous job 1" />
    </div>
    <div class="gallery-item">
      <img src="/gallery/project2.jpg" alt="Previous job 2" />
    </div>
    <div class="gallery-item">
      <img src="/gallery/project3.jpg" alt="Previous job 3" />
    </div>
    <div class="gallery-item">
      <img src="/gallery/project4.jpg" alt="Previous job 4" />
    </div>
    <div class="gallery-item">
      <img src="/gallery/project5.jpg" alt="Previous job 5" />
    </div>
    <div class="gallery-item">
      <img src="/gallery/project6.jpg" alt="Previous job 6" />
    </div>
    <div class="gallery-item">
      <img src="/gallery/project7.jpg" alt="Previous job 7" />
    </div>
    <div class="gallery-item">
      <img src="/gallery/project8.jpg" alt="Previous job 8" />
    </div>
    <div class="gallery-item">
      <img src="/gallery/project9.jpg" alt="Previous job 9" />
    </div>
    <div class="gallery-item">
      <img src="/gallery/project10.jpg" alt="Previous job 10" />
    </div>
  </div>
</section>

<section class="estimate-info">
  <p class="estimate-text">
    To get a rough estimate, go to the quick quote. Keep in mind this is just an estimate 
    and if you want an actual quote give us a call and time to give you an accurate quote.
  </p>
</section>

<div class="button-container">
  <button type="button" class="quote-button" onclick={() => goto('/quote')}>
    Get a Free Quote →
  </button>
</div>

<style>
  body {
    background-color: #2C3E6B;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    background-color: #2C3E6B;
  }
  
  .hero {
    text-align: center;
    padding: 2rem 1rem;
    background: linear-gradient(135deg, #2A1B38 0%, #4A2C1B 100%);
    border-radius: 12px;
    color: white;
    margin-bottom: 2rem;
  }
  
  .logo-container {
    margin-bottom: 1.5rem;
  }
  
  .logo {
    max-width: 400px;
    height: auto;
    border-radius: 15%;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  }
  
  .hero h1 {
    font-size: 2rem;
    margin: 0;
    color: white;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  }
  
  .about-section {
    background-color: #FDF8F5;
    padding: 2rem;
    border-radius: 12px;
    margin-bottom: 2rem;
    border-left: 5px solid #B3412D;
    text-align: center;
  }
  
  .about-section h2 {
    color: #B3412D;
    margin-bottom: 1rem;
    font-size: 1.75rem;
    border-bottom: 2px solid #B3412D;
    display: inline-block;
    padding-bottom: 0.5rem;
    text-align: center;
  }
  
  .about-content p {
    color: #1A1A1A;
    line-height: 1.6;
    margin-bottom: 1rem;
    font-size: 1rem;
    text-align: left;
  }
  
  .gallery-section {
    margin-bottom: 2rem;
  }
  
  .gallery-section h2 {
    color: #B3412D;
    margin-bottom: 1.5rem;
    font-size: 1.75rem;
    text-align: center;
    position: relative;
  }
  
  .gallery-section h2:after {
    content: '';
    display: block;
    width: 60px;
    height: 3px;
    background: #B3412D;
    margin: 10px auto 0;
  }
  
  .gallery {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    margin-top: 1rem;
  }
  
  .gallery-item {
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;
    border: 1px solid #B3412D;
  }
  
  .gallery-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 15px rgba(179,65,45,0.4);
  }
  
  .gallery-item img {
    width: 100%;
    height: auto;
    object-fit: contain;
    display: block;
  }
  
  .estimate-info {
    background-color: #FDF8F5;
    padding: 1.5rem;
    border-radius: 12px;
    margin-bottom: 2rem;
    text-align: center;
    border: 2px solid #B3412D;
  }
  
  .estimate-text {
    color: #1A1A1A;
    font-size: 1.1rem;
    line-height: 1.6;
    margin: 0;
    font-weight: 500;
  }
  
  .button-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 2rem 0;
  }
  
  .quote-button {
    background-color: #B3412D;
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  }
  
  .quote-button:hover {
    background-color: #8B2A1A;
    transform: scale(1.05);
    box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  }
  
  p {
    text-align: center;
    color: #D4DFF5;
    margin-top: 1rem;
    font-size: 0.85rem;
  }
  
  small, .small-text {
    color: #1A1A1A;
  }
  
  @media (max-width: 768px) {
    .gallery {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    
    .hero h1 {
      font-size: 1.5rem;
    }
    
    .about-section h2,
    .gallery-section h2 {
      font-size: 1.5rem;
    }
    
    .logo {
      max-width: 250px;
    }
    
    .estimate-text {
      font-size: 0.95rem;
    }
  }
</style>