# GitHub Commands for TJCApp

Run all commands from inside the project folder:

```powershell
cd E:\Legacies\TJCApp
```

---

## 1. Check the project status

```powershell
git status
```

`node_modules` and `.next` are listed in `.gitignore`, so they are not committed.

---

## 2. Set your git identity (one time only)

```powershell
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

---

## 3. Make the first commit

```powershell
git add .
git commit -m "Initial commit: TJC front page and login page"
```

---

## 4. Create the GitHub repository and push

### Option A: GitHub CLI (recommended)

```powershell
gh auth login
gh repo create TJCApp --private --source=. --remote=origin --push
```

Use `--public` instead of `--private` to make the repository public.

### Option B: Browser

1. Go to https://github.com/new
2. Create a repository named `TJCApp`. Leave "Add a README", ".gitignore" and "license" **unticked**.
3. Connect and push:

```powershell
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/TJCApp.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username.

When git asks for a password, use a **personal access token**, not your account password.
Create one at https://github.com/settings/tokens

---

## 5. Push later changes

```powershell
git add .
git commit -m "Describe what changed"
git push
```

---

## Useful commands

| Command | What it does |
|---|---|
| `git status` | Show changed files |
| `git log --oneline` | Show commit history |
| `git remote -v` | Show the connected GitHub repository |
| `git pull` | Download the latest changes from GitHub |
| `git diff` | Show unstaged changes |
