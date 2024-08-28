import express from "express";
import bodyParser from "body-parser";

const app = express();
const PORT = 3000;

// In-memory array for storing todos
let posts = [];
let counter = 0;
const generateId = () => counter++;
let categorys = ["Technology","Mindset","Investment"];
// Use EJS as the templating engine
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (CSS, images) from a "public" directory
app.use(express.static('public'));

// Home page route
app.get('/', (req, res) => {
  res.render('index', { posts,categorys });
});

// Post creation route (GET for form, POST for submission)
app.get('/create', (req, res) => {
  res.render('create',{
    categorys
  });
});

app.post('/create', (req, res) => {
  const newId = generateId();
  const  post  = {
    id : newId,
    title : req.body.postTitle,
    content : req.body.postContent,
    category: req.body.postCategory
  };

  posts.push(post);
  res.redirect('/');
});

// Edit post route (GET for displaying form, POST for updating)
// Get post for editing (GET)
app.get('/edit/:id', (req, res) => {
  const id = req.params.id;
  const post = posts.find(post => post.id === Number(id)); // Ensure numerical ID
  if (!post) {
    return res.sendStatus(404); // Handle non-existent post
  }
  res.render('edit', { post,categorys }); // Pass post object to the template
});

// Update post (POST)
app.post('/edit/:id', (req, res) => {
  const id = req.params.id;
  const { title, content,category } = req.body; // Extract updated data
  const index = posts.findIndex(post => post.id === Number(id)); // Find index
  if (index !== -1) { // Check if post exists
    posts[index] = { ...posts[index], title, content, category}; // Update post in-place
    res.redirect('/'); // Redirect to home page after successful update
  } else {
    res.sendStatus(404); // Handle non-existent post
  }
});


// Delete post route
app.post('/delete/:id', (req, res) => {
  const id = req.params.id;
  const index = posts.findIndex(post => post.id === Number(id));
  posts.splice(index, 1);
  res.redirect('/');
});

app.get('/posts/:id', (req, res) => {
  const requestedId = req.params.id;

  const post = posts.find(post => post.id === Number(requestedId)); // Find the post by ID

  if (post) { // Check if the post exists
    res.render('view', {
      title: post.title,
      content: post.content,categorys
    });
  } else {
    res.status(404).send('Post not found'); // Handle non-existent post
  }
});

app.get('/category/:category?', (req, res) => {
  // Get the selected category from the URL parameter
  const requestedCategory = req.params.category || ""; // Handle optional category
  // Filter posts based on the category (if provided)
  const filteredPosts = requestedCategory
    ? posts.filter(post => post.category === requestedCategory)
    : posts; // Show all posts if no category is selected

  if (filteredPosts.length > 0) {
    // Render the list of filtered posts
    res.render('category', { posts: filteredPosts,categorys }); // Use index.ejs to render post list
  } else {
    // Handle no posts found for the selected category
    res.status(404).send('No posts found in this category.');
  }
});



// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
