# 🚨 SECURITY SETUP GUIDE

## Admin Account Setup

### ⚠️ IMPORTANT SECURITY NOTICE
The file `setupSpecificAdmins.js` contains sensitive credentials and is excluded from version control for security reasons.

### Setting Up Admin Accounts

1. **Copy the example file:**
   ```bash
   cp src/setupAdmins.example.js src/setupSpecificAdmins.js
   ```

2. **Edit the file and replace with your actual credentials:**
   - Change usernames to your preferred usernames
   - Change emails to your actual email addresses  
   - Change passwords to your secure passwords
   - Update names to actual names

3. **Run the setup:**
   ```bash
   node src/setupSpecificAdmins.js
   ```

4. **Delete the setup file after use (optional):**
   ```bash
   rm src/setupSpecificAdmins.js
   ```

### Environment Variables

1. **Copy the environment example:**
   ```bash
   cp .env.example .env
   ```

2. **Update .env with your actual values:**
   - Set a strong JWT_SECRET
   - Configure your MongoDB URI
   - Set other environment-specific values

### Security Best Practices

- ✅ Never commit files with real passwords
- ✅ Use strong, unique passwords for each admin
- ✅ Store sensitive data in environment variables
- ✅ Keep .env files in .gitignore
- ✅ Use HTTPS in production
- ✅ Regularly rotate passwords and JWT secrets

### Default Admin Roles

All admin accounts have the same permissions:
- Manage deals and categories
- Manage blog posts
- View analytics
- Manage newsletter subscribers
- Full admin dashboard access

Website visitors can access all content for FREE without creating accounts.
