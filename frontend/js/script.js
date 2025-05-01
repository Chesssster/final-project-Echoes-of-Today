fetch('http://localhost:5000/api/users')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error('Error fetching:', err));
