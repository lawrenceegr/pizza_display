<!-- App.svelte -->
<script>
    import { Router, Route, Link } from "svelte-routing";
    import Users from './routes/Users.svelte';
    import Products from './routes/Products.svelte';
    import Home from './routes/Home.svelte';  // Make sure you have the relevant components
  </script>
  
  <Router>
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/users">Users</Link></li>
        <li><Link to="/products">Products</Link></li>
      </ul>
    </nav>
  
    <Route path="/" component={Home} />
    <Route path="/users" component={Users} />
    <Route path="/products" component={Products} />
  </Router>
  
  <style>
    nav {
      margin-bottom: 20px;
    }
    ul {
      list-style-type: none;
      padding: 0;
    }
    li {
      display: inline-block;
      margin-right: 20px;
    }
  </style>
  