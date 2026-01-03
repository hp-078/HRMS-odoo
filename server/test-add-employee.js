const http = require('http');

// Test Add Employee
const addEmployee = () => {
  const data = JSON.stringify({
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice.johnson@dayflow.com',
    department: 'Product',
    designation: 'Product Manager',
    salary: 88000,
    role: 'EMPLOYEE'
  });

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/employees',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const req = http.request(options, (res) => {
    let responseData = '';

    res.on('data', (chunk) => {
      responseData += chunk;
    });

    res.on('end', () => {
      console.log('\n✅ Employee Added Successfully!');
      console.log(JSON.parse(responseData));
    });
  });

  req.on('error', (error) => {
    console.error('❌ Error:', error.message);
  });

  req.write(data);
  req.end();
};

// Run test
console.log('🧪 Testing Add Employee API...\n');
addEmployee();
