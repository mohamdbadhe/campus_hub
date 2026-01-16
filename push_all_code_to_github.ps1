# PowerShell Script to Push ALL Project Code to GitHub
# This will push the entire project, not just specific user stories

Write-Host "=== Preparing to push ALL project code to GitHub ===" -ForegroundColor Cyan
Write-Host ""

# Change to project directory
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

# Check if git is initialized
if (-not (Test-Path .git)) {
    Write-Host "Initializing git repository..." -ForegroundColor Yellow
    git init
}

# Check if .gitignore exists, create one if not
if (-not (Test-Path .gitignore)) {
    Write-Host "Creating .gitignore file..." -ForegroundColor Yellow
    @"
# Dependencies
node_modules/
__pycache__/
*.pyc
*.pyo
*.pyd
.Python

# Environment variables
.env
.venv
venv/
ENV/

# IDE
.vscode/
.idea/
*.swp
*.swo

# Database
db.sqlite3
*.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build outputs
dist/
build/
*.egg-info/

# OS
.DS_Store
Thumbs.db

# Testing
.coverage
htmlcov/

# Temporary files
*.tmp
*.bak
"@ | Out-File -FilePath ".gitignore" -Encoding UTF8
    Write-Host "✓ Created .gitignore" -ForegroundColor Green
}

# Stage .gitignore first
git add .gitignore
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Staged .gitignore" -ForegroundColor Green
}

# Add ALL files (except those in .gitignore)
Write-Host ""
Write-Host "Adding ALL project files to git..." -ForegroundColor Yellow
Write-Host "(This may take a moment if there are many files)" -ForegroundColor Gray
Write-Host ""

# Add all files
git add .

# Show what will be committed
Write-Host ""
Write-Host "Files to be committed:" -ForegroundColor Cyan
git status --short | Select-Object -First 20
$totalFiles = (git status --short).Count
Write-Host "... and $totalFiles total files" -ForegroundColor Gray
Write-Host ""

# Check if there are any changes to commit
$status = git status --porcelain
if (-not $status) {
    Write-Host "No changes to commit. All files are already committed." -ForegroundColor Yellow
    $commitNeeded = $false
} else {
    $commitNeeded = $true
}

if ($commitNeeded) {
    # Ask for confirmation
    $confirm = Read-Host "Do you want to commit all these files? (y/n)"
    if ($confirm -ne "y" -and $confirm -ne "Y") {
        Write-Host "Operation cancelled. Files are staged but not committed." -ForegroundColor Yellow
        Write-Host "Run 'git commit -m \"Your message\"' when ready." -ForegroundColor Gray
        exit
    }

    # Commit all files
    Write-Host ""
    Write-Host "Committing all files..." -ForegroundColor Yellow
    $commitMessage = Read-Host "Enter commit message (or press Enter for default)"
    if ([string]::IsNullOrWhiteSpace($commitMessage)) {
        $commitMessage = "Initial commit: Complete Campus Navigator project"
    }
    
    git commit -m $commitMessage
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ All files committed successfully!" -ForegroundColor Green
    } else {
        Write-Host "✗ Error committing files" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "=== Setup Complete ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps to push to GitHub:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Create a repository on GitHub.com (if not already created):" -ForegroundColor White
Write-Host "   - Go to https://github.com" -ForegroundColor Gray
Write-Host "   - Click '+' → 'New repository'" -ForegroundColor Gray
Write-Host "   - Name it (e.g., 'campus-navigator' or 'project-ysodot')" -ForegroundColor Gray
Write-Host "   - DON'T initialize with README/gitignore" -ForegroundColor Gray
Write-Host "   - Click 'Create repository'" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Copy your repository URL from GitHub" -ForegroundColor White
Write-Host ""
Write-Host "3. Add remote and push:" -ForegroundColor White
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git" -ForegroundColor Gray
Write-Host "   git branch -M main" -ForegroundColor Gray
Write-Host "   git push -u origin main" -ForegroundColor Gray
Write-Host ""

# Check if remote already exists
$remoteExists = git remote | Select-String -Pattern "origin"
if ($remoteExists) {
    $currentRemote = git remote get-url origin
    Write-Host "⚠ Remote 'origin' already exists: $currentRemote" -ForegroundColor Yellow
    Write-Host ""
    $changeRemote = Read-Host "Do you want to change it to a new repository? (y/n)"
    if ($changeRemote -eq "y" -or $changeRemote -eq "Y") {
        $newRemote = Read-Host "Enter new repository URL"
        git remote remove origin
        git remote add origin $newRemote
        Write-Host "✓ Remote updated to: $newRemote" -ForegroundColor Green
        Write-Host ""
        Write-Host "Now push to GitHub:" -ForegroundColor Yellow
        Write-Host "   git push -u origin main" -ForegroundColor Gray
    }
} else {
    # Ask if user wants to add remote now
    $addRemote = Read-Host "Do you want to add the GitHub remote URL now? (y/n)"
    if ($addRemote -eq "y" -or $addRemote -eq "Y") {
        $repoUrl = Read-Host "Enter your GitHub repository URL (e.g., https://github.com/username/repo.git)"
        git remote add origin $repoUrl
        Write-Host "✓ Remote added: $repoUrl" -ForegroundColor Green
        Write-Host ""
        
        # Ask if user wants to push now
        $pushNow = Read-Host "Do you want to push to GitHub now? (y/n)"
        if ($pushNow -eq "y" -or $pushNow -eq "Y") {
            Write-Host ""
            Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
            
            # Ensure we're on main branch
            $currentBranch = git branch --show-current
            if (-not $currentBranch -or $currentBranch -ne "main") {
                if ($currentBranch) {
                    git branch -M main
                } else {
                    git checkout -b main
                }
            }
            
            git push -u origin main
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host ""
                Write-Host "✓ Successfully pushed all code to GitHub!" -ForegroundColor Green
                Write-Host ""
                Write-Host "Your code is now available at:" -ForegroundColor Cyan
                Write-Host "   https://github.com/YOUR_USERNAME/YOUR_REPO_NAME" -ForegroundColor White
            } else {
                Write-Host ""
                Write-Host "✗ Error pushing to GitHub. You may need to:" -ForegroundColor Red
                Write-Host "   - Check your internet connection" -ForegroundColor Gray
                Write-Host "   - Verify the repository URL is correct" -ForegroundColor Gray
                Write-Host "   - Authenticate with GitHub (may need Personal Access Token)" -ForegroundColor Gray
            }
        }
    }
}

Write-Host ""
Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "✓ All project files have been added to git" -ForegroundColor Green
if ($commitNeeded) {
    Write-Host "✓ Files have been committed" -ForegroundColor Green
}
Write-Host ""
Write-Host "To share with friends:" -ForegroundColor Yellow
Write-Host "1. Push to GitHub (instructions above)" -ForegroundColor White
Write-Host "2. Share the repository URL with them" -ForegroundColor White
Write-Host "3. They can clone it with: git clone YOUR_REPO_URL" -ForegroundColor White
