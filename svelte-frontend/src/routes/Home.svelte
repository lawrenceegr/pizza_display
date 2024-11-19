<!-- Home.svelte -->
<script>
    // You can add any specific functionality you want here.
    let message = "Welcome to the Home Page!";
    import { Skull } from "lucide-svelte";
  </script>
  
  <main>
    <h1>{message}</h1>
    <p>This is the homepage of your Svelte app.</p>
    <Skull size="24" />
    <p>Feel free to navigate to other pages using the links above.</p>
  </main>
  
  <style>
    main {
      font-family: Arial, sans-serif;
      padding: 20px;
    }
  
    h1 {
      color: #333;
    }
  
    p {
      color: #555;
    }
  </style>
  