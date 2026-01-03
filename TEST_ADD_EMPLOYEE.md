# Test Add Employee API

## Test using PowerShell

```powershell
# Add a new employee
$body = @{
    firstName = "Alice"
    lastName = "Johnson"
    email = "alice.johnson@dayflow.com"
    department = "Product"
    designation = "Product Manager"
    salary = 88000
    role = "EMPLOYEE"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/employees" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body
```

## Test using cURL

```bash
curl -X POST http://localhost:5000/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Alice",
    "lastName": "Johnson",
    "email": "alice.johnson@dayflow.com",
    "department": "Product",
    "designation": "Product Manager",
    "salary": 88000,
    "role": "EMPLOYEE"
  }'
```

## Get All Employees

```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/employees"
```

## Delete Employee (by ID)

```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/employees/{employee-id}" `
    -Method Delete
```

## Frontend Testing

1. Navigate to Employee Management page
2. Click "Add New Employee" button
3. Fill in the form:
   - First Name: Test
   - Last Name: Employee
   - Email: test@dayflow.com
   - Department: Testing
   - Designation: QA Engineer
   - Salary: 60000
   - Role: Employee
4. Click "Add Employee"
5. Verify the new employee appears in the table
6. Click "Delete" to remove the employee
