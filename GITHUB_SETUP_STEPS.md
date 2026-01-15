# GitHub Setup Steps - Where Your Code Will Go

This guide explains where your code will be pushed on GitHub and how to set it up.

---

## 📍 Where Will Your Code Go?

Your code will go to a **GitHub repository** (repo) that **you need to create first**.

The repository URL will look like:
```
https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

Example:
```
https://github.com/john-doe/campus-navigator-us-2-5-7.git
```

---

## 🚀 Step-by-Step Setup

### Step 1: Create GitHub Account (if you don't have one)

1. Go to [github.com](https://github.com)
2. Click "Sign up"
3. Follow the registration process

---

### Step 2: Create a New Repository on GitHub

1. **Log in to GitHub**
2. **Click the "+" icon** in the top right corner
3. **Click "New repository"**

4. **Fill in the repository details:**
   - **Repository name**: Choose a name (e.g., `campus-navigator-us-2-5-7` or `project-ysodot`)
   - **Description** (optional): "Campus Navigator - User Stories 2, 5, and 7"
   - **Visibility**: 
     - ☑️ **Public** (anyone can see it)
     - ☐ **Private** (only you can see it)
   - **DO NOT** check any of these:
     - ❌ Add a README file
     - ❌ Add .gitignore
     - ❌ Choose a license

5. **Click "Create repository"**

6. **Copy the repository URL** that appears on the next page:
   ```
   https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   ```
   ⚠️ **Save this URL!** You'll need it later.

---

### Step 3: Run the Script (or Manual Steps)

#### Option A: Using the Script

1. **Run the script:**
   ```powershell
   .\push_us_2_5_7_separate_branches.ps1
   ```

2. **When the script asks for the remote URL**, paste the repository URL you copied:
   ```
   https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   ```

#### Option B: Manual Steps

1. **Add the remote repository:**
   ```powershell
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   ```

2. **Push all branches:**
   ```powershell
   git push --all origin
   ```

---

## 📂 What Will Appear on GitHub?

After pushing, your GitHub repository will show:

### **Branches Tab:**
- `main` - Main branch (usually just has .gitignore)
- `feature/US-2-find-available-lab` - US-2 code
- `feature/US-5-approve-room-allocation` - US-5 code
- `feature/US-7-track-manage-faults` - US-7 code

### **Files Structure:**
When you select a branch, you'll see:
- `src/` folder with pages and components
- `backend/` folder with models and views
- `README.md` file for that user story

---

## 🔍 Finding Your Repository After Pushing

1. **Go to GitHub.com**
2. **Click your profile picture** (top right)
3. **Click "Your repositories"**
4. **Click on your repository name**
5. **Click the branch dropdown** (top left) to see all branches

---

## 📝 Example Repository URL Format

```
https://github.com/[YOUR_USERNAME]/[YOUR_REPO_NAME].git
```

**Real examples:**
- `https://github.com/mohamed123/campus-navigator-us-2-5-7.git`
- `https://github.com/student2024/project-ysodot.git`
- `https://github.com/john-doe/campus-navigator.git`

---

## ⚙️ If You Already Have a Repository

If you already created a repository and want to use it:

1. **Go to your repository on GitHub**
2. **Click the green "Code" button**
3. **Copy the HTTPS URL**
4. **Use it as the remote origin:**
   ```powershell
   git remote add origin [YOUR_COPIED_URL]
   ```

---

## 🆘 Common Issues

### Issue: "remote origin already exists"
```powershell
# Remove the existing remote
git remote remove origin

# Add your repository URL
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

### Issue: "repository not found"
- Make sure the repository name is correct
- Make sure you're logged in to GitHub
- Check if the repository is private (you need to authenticate)

### Issue: Authentication required
If GitHub asks for authentication:

**Option 1: Use GitHub Personal Access Token**
1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Generate a new token with `repo` permissions
3. Use the token as your password when pushing

**Option 2: Use GitHub CLI**
```powershell
# Install GitHub CLI first, then:
gh auth login
```

---

## ✅ Quick Checklist

Before pushing:
- [ ] GitHub account created
- [ ] Repository created on GitHub
- [ ] Repository URL copied
- [ ] Script run (or manual commands executed)
- [ ] Remote origin added
- [ ] Branches pushed

After pushing:
- [ ] Go to GitHub and verify all branches appear
- [ ] Check that files are visible in each branch
- [ ] Verify README.md files exist

---

## 📍 Where to Find Your Code on GitHub

**After pushing, your code will be at:**

```
https://github.com/YOUR_USERNAME/YOUR_REPO_NAME
```

**To view a specific branch:**
```
https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/tree/feature/US-2-find-available-lab
```

**To view US-5:**
```
https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/tree/feature/US-5-approve-room-allocation
```

**To view US-7:**
```
https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/tree/feature/US-7-track-manage-faults
```

---

## 💡 Summary

1. **Create a repository** on GitHub.com
2. **Copy the repository URL**
3. **Run the script** or add the remote manually
4. **Push the branches**
5. **View your code** at: `https://github.com/YOUR_USERNAME/YOUR_REPO_NAME`

That's it! Your code will be visible on GitHub in the repository you create.
