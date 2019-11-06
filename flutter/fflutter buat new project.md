# flutter new project

If you are someone like me, who uses Visual Studio Code to work with Flutter, you would most likely be using Flutter CLI to create new flutter projects.

Flutter CLI, by default, would use com.example.project_name as your package name/bundle identifier. If you want to specify to change that behaviour, you can run
`flutter create --org com.my_cool_org project_name`
This would set the Android package name to 
> com.my_cool_org.project_name and 
>
> iOS bundle identifier to com.myCoolOrg.projectName
