# hack4good2026

# Clone repository (everyone at the start)
1. ``` git clone https://github.com/0218hy/hack4good2026.git```
2. ```cd hack4good2026```
3. ```code .```

# Branching rules
DO NOT code on main 
1. Create a feature branch (each task)
    ```git checkout -b feature/auth-login```
2. Naming convention
    feature/<short-description>
    bugfix/<short-description>

# Daily Coding Workflow
1. Pull latest changes
    ```git pull origin main```
2. Code on your branch 
3. Commit (upload for everyone to see the changes)
    ```git add .```
    ```git commit -, "Add auth login logic"```
4. Push your branch
    ```git push origin feature/auth-login```

# For pull request (PR)
1. Go to GitHub 
2. Click compare & pull request
3. Title: "Add login authentication"

# Basic rules
DO
- Pull before you start coding
- One feature per branch
- Small commits with clear messages
DO NOT
- Push directly to main
- Work on the same file without telling teammates
- Commit broken code