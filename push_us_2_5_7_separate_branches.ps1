# PowerShell Script to Push US-2, US-5, and US-7 to Separate GitHub Branches
# Run this script from the project root directory

Write-Host "=== Preparing to push US-2, US-5, and US-7 to separate branches ===" -ForegroundColor Cyan
Write-Host ""

# Change to project directory
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

# Check if git is initialized
if (-not (Test-Path .git)) {
    Write-Host "Initializing git repository..." -ForegroundColor Yellow
    git init
}

# Define files for each User Story

# US-2: Find Available Lab
$US2_Files = @(
    "src/pages/FindLabs.jsx",
    "src/components/cards/LabCard.jsx"
)

# US-5: Approve Room Allocation
$US5_Files = @(
    "src/pages/RequestApprovals.jsx",
    "src/components/cards/RequestCard.jsx"
)

# US-7: Track and Manage Faults
$US7_Files = @(
    "src/pages/FaultManagement.jsx",
    "src/pages/Reports.jsx",
    "src/components/cards/FaultCard.jsx"
)

# Shared/Supporting files needed (will be added to all branches)
$Shared_Files = @(
    "src/api/entities.js",
    "src/api/base44Client.js",
    "src/components/ui/card.jsx",
    "src/components/ui/button.jsx",
    "src/components/ui/input.jsx",
    "src/components/ui/badge.jsx",
    "src/components/ui/tabs.jsx",
    "src/components/ui/select.jsx",
    "src/components/ui/dialog.jsx",
    "src/components/ui/sheet.jsx",
    "src/components/ui/skeleton.jsx",
    "src/components/ui/progress.jsx",
    "src/components/ui/textarea.jsx",
    "src/components/ui/label.jsx",
    "src/lib/utils.js"
)

# Backend files (shared across user stories)
$Backend_Files = @(
    "backend/accounts/models.py",
    "backend/accounts/views.py",
    "backend/accounts/urls.py"
)

# Function to create branch and push files
function Push-UserStory {
    param(
        [string]$BranchName,
        [string]$UserStoryNumber,
        [string]$UserStoryName,
        [array]$UserStoryFiles,
        [array]$AllFiles
    )
    
    Write-Host ""
    Write-Host "=== Processing $UserStoryNumber: $UserStoryName ===" -ForegroundColor Magenta
    Write-Host ""
    
    # Checkout or create branch
    $branchExists = git branch --list $BranchName
    if ($branchExists) {
        Write-Host "Branch '$BranchName' already exists. Checking it out..." -ForegroundColor Yellow
        git checkout $BranchName
        # Reset branch to remove any previous commits (optional - comment out if you want to keep history)
        # git reset --hard origin/main  # Uncomment if you want to reset
    } else {
        Write-Host "Creating new branch: $BranchName" -ForegroundColor Yellow
        git checkout -b $BranchName 2>$null
        if ($LASTEXITCODE -ne 0) {
            # If main/master doesn't exist, create it first
            git checkout -b main
            git checkout -b $BranchName
        }
    }
    
    # Reset staging area
    git reset
    
    # Filter to only existing files for this US
    $ExistingFiles = @()
    foreach ($file in $AllFiles) {
        if (Test-Path $file) {
            $ExistingFiles += $file
            Write-Host "  ✓ $file" -ForegroundColor Green
        } else {
            Write-Host "  ✗ Missing: $file" -ForegroundColor Red
        }
    }
    
    Write-Host ""
    Write-Host "Files for $UserStoryNumber:" -ForegroundColor Cyan
    Write-Host "  User Story files: $($UserStoryFiles.Count)"
    Write-Host "  Shared files: $($Shared_Files.Count)"
    Write-Host "  Backend files: $($Backend_Files.Count)"
    Write-Host "  Total: $($ExistingFiles.Count) files"
    Write-Host ""
    
    # Add files to staging
    Write-Host "Adding files to git..." -ForegroundColor Yellow
    foreach ($file in $ExistingFiles) {
        git add $file
    }
    
    # Create README for this user story
    $readmeContent = @"
# $UserStoryNumber: $UserStoryName

This branch contains the implementation for **$UserStoryNumber: $UserStoryName**.

## Files Included

### User Story Specific Files
$($UserStoryFiles | ForEach-Object { "- \`$_" } | Out-String)

### Backend Files
- \`backend/accounts/models.py\` - Contains relevant models
- \`backend/accounts/views.py\` - Contains relevant API endpoints
- \`backend/accounts/urls.py\` - URL routing

### Shared Dependencies
- UI components in \`src/components/ui/\`
- API client and utilities
- Common utilities in \`src/lib/\`

## Notes

- Backend files (\`models.py\` and \`views.py\`) contain code for multiple user stories
- Only the sections relevant to $UserStoryNumber are used in this implementation
"@

    $readmeContent | Out-File -FilePath "README.md" -Encoding UTF8 -Force
    git add README.md
    
    # Commit changes
    Write-Host ""
    Write-Host "Committing changes..." -ForegroundColor Yellow
    $commitMessage = "feat($UserStoryNumber): Add $UserStoryName implementation"
    git commit -m $commitMessage
    
    Write-Host ""
    Write-Host "✓ $UserStoryNumber committed to branch '$BranchName'" -ForegroundColor Green
}

# Check existing files first
Write-Host "Checking files..." -ForegroundColor Yellow
$allFilesList = $US2_Files + $US5_Files + $US7_Files + $Shared_Files + $Backend_Files
$missingFiles = @()
foreach ($file in $allFilesList) {
    if (-not (Test-Path $file)) {
        $missingFiles += $file
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Host ""
    Write-Host "Warning: The following files are missing:" -ForegroundColor Yellow
    foreach ($file in $missingFiles) {
        Write-Host "  - $file" -ForegroundColor Red
    }
    Write-Host ""
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y" -and $continue -ne "Y") {
        Write-Host "Operation cancelled." -ForegroundColor Yellow
        exit
    }
}

# Ask for confirmation
Write-Host ""
Write-Host "This will create 3 branches:" -ForegroundColor Cyan
Write-Host "  1. feature/US-2-find-available-lab"
Write-Host "  2. feature/US-5-approve-room-allocation"
Write-Host "  3. feature/US-7-track-manage-faults"
Write-Host ""
$confirm = Read-Host "Do you want to proceed? (y/n)"
if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "Operation cancelled." -ForegroundColor Yellow
    exit
}

# Ensure we start from main/master
$currentBranch = git branch --show-current
if (-not $currentBranch) {
    Write-Host "Creating initial main branch..." -ForegroundColor Yellow
    git checkout -b main
    # Create .gitignore if it doesn't exist
    if (-not (Test-Path .gitignore)) {
        @"
node_modules/
__pycache__/
*.pyc
.env
.vscode/
*.log
db.sqlite3
venv/
.venv/
dist/
build/
"@ | Out-File -FilePath ".gitignore" -Encoding UTF8
        git add .gitignore
        git commit -m "chore: Add .gitignore"
    }
}

# Process US-2
$US2_AllFiles = $US2_Files + $Shared_Files + $Backend_Files
Push-UserStory -BranchName "feature/US-2-find-available-lab" `
                -UserStoryNumber "US-2" `
                -UserStoryName "Find Available Lab" `
                -UserStoryFiles $US2_Files `
                -AllFiles $US2_AllFiles

# Process US-5
$US5_AllFiles = $US5_Files + $Shared_Files + $Backend_Files
Push-UserStory -BranchName "feature/US-5-approve-room-allocation" `
                -UserStoryNumber "US-5" `
                -UserStoryName "Approve Room Allocation" `
                -UserStoryFiles $US5_Files `
                -AllFiles $US5_AllFiles

# Process US-7
$US7_AllFiles = $US7_Files + $Shared_Files + $Backend_Files
Push-UserStory -BranchName "feature/US-7-track-manage-faults" `
                -UserStoryNumber "US-7" `
                -UserStoryName "Track and Manage Faults" `
                -UserStoryFiles $US7_Files `
                -AllFiles $US7_AllFiles

# Return to main branch
git checkout main 2>$null
if ($LASTEXITCODE -ne 0) {
    git checkout -b main
}

Write-Host ""
Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "✓ Created 3 branches:" -ForegroundColor Green
Write-Host "  1. feature/US-2-find-available-lab" -ForegroundColor White
Write-Host "  2. feature/US-5-approve-room-allocation" -ForegroundColor White
Write-Host "  3. feature/US-7-track-manage-faults" -ForegroundColor White
Write-Host ""

Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Add remote (if not already added):" -ForegroundColor White
Write-Host "   git remote add origin <your-github-repo-url>" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Push all branches to GitHub:" -ForegroundColor White
Write-Host "   git push -u origin feature/US-2-find-available-lab" -ForegroundColor Gray
Write-Host "   git push -u origin feature/US-5-approve-room-allocation" -ForegroundColor Gray
Write-Host "   git push -u origin feature/US-7-track-manage-faults" -ForegroundColor Gray
Write-Host ""
Write-Host "Or push all branches at once:" -ForegroundColor White
Write-Host "   git push --all origin" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Push main branch:" -ForegroundColor White
Write-Host "   git push -u origin main" -ForegroundColor Gray
