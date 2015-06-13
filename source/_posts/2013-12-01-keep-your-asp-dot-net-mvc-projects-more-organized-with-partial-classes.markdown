---
layout: post
title: "Keep your ASP.NET MVC projects organized with partial classes"
date: 2013-12-01 10:57
comments: true
categories: [dev,csharp,aspnet,better-mvc]
published: true
---

I use partial classes for controller and service classes to keep my ASP.NET MVC projects more organized.

### The default behavior (file-per-controller) creates large files with lots of methods
I've built many projects that use the standard Visual Studio csproj template, which creates a file per controller.  Over time, a controller may accumulate many methods (tens or even hundreds)

This makes these files difficult to read and navigate.
![messy controller](/images/messy-controller.png)

## Controllers

### Store ViewModels in the same file as controller methods
ViewModels are coupled to a controller and a view.  
{% gist 7739637 %}

## WebAPI

### Store GET/POST/DELETE/PUT methods in the different files
When using WebAPI, you will have multiple methods that apply to the same resource, for saving, deleting, updating, etc.  

Each of these methods will have a different view model and controller action.

Create a directory with the name of the controller, and create each WebAPI controller as a partial.

Store each WebAPI action in a separate file, along with it's associated ViewModel.

{% gist 7752207 %}

## Services
### Store DTOs in the same file as service methods
In a Request/Response pattern, DTOs are coupled to service methods.  

By storing the request and response in the same file, it is easier to make changes.

### Store interface definitions in the same file as service methods
If you use a Dependency Injection Framework (such as [Ninject](http://www.ninject.org)), you will have an interface definition for each public service method.  This creates file navigation problems with a typical ASP.NET MVC project, since hitting F12 on a method call from a controller will land you on the interface definition, as opposed to the method implementation.

By putting the interface definition in the same file as the primary method definition, you can simply scroll down the page to implementation.  You can also use a tool like [ReSharper](http://www.jetbrains.com/resharper/), but I find that workflow to require more navigation than simply housing these files together.

{% gist 7752306 %}

## Version Control and Code Review

### Use shell commands to navigate files
Shell commands (powershell, dos, bash) become much more powerful when your code is organized by granularly by files.

* Sort by alpha, date modified, size changes
* Use git status / hg st to find which sections of code changed

### Reduce Merge Conflicts by organizing files more granularly
The bane of a developers existence is a merge conflict.   In common workflows, a team of developers often work on one feature of the code at a time, and teams try to make an effort not to work on the same "area".

When different areas of code are combined into one file, merge conflicts arise.

In ASP.NET MVC, this means you may be working on a few controller method, views, and service methods to implement a new feature.   

By reducing the size of files you are working on, and keeping them organized by subject, it is less likely that you will have conflicts with other developers.  Or, you may only have them in the .csproj file, where it is fairly trivial and safe to resolve.

### Make Code Reviews easier to Read
If you use git or mercurial for source control, you will often do code reviews by reviewing a branch of code(ie., feature-branch), and comparing it to another branch (ie, develop).

When doing these comparisons, you will see a series of commits that are grouped by file.  If associated assets (DTOs or ViewModels) reside in the same file as the methods that they support, it is easier to review, since you don't have to jump around as much.

You can also quickly scan filenames to understand the subject of the change.

![github diff](/images/github-diff.png)

### Better MVC
I am organizing these practices into a project on Github, humbly called [BetterMVC](https://github.com/tarr11/BetterMVC).  

My goal is to make BetterMVC a lightweight project template that allows you to start new MVC projects in a clean way, and adopt some best practices along the way.  Right now, it is simply more of a reference.

[Fork BetterMVC Here](https://github.com/tarr11/BetterMVC)

