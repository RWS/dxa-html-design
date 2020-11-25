SDL Digital Experience Accelerator Whitelabel HTML Design
===


About
-----
The SDL Digital Experience Accelerator (DXA) is a reference implementation of SDL Tridion Sites 9 and SDL Web 8 intended to help you create, design and publish an SDL Tridion/Web-based website quickly.

DXA is available for both .NET and Java web applications. Its modular architecture consists of a framework and example web application, which includes all core SDL Tridion/Web functionality as well as separate Modules for additional, optional functionality.

This repository contains the source code of the DXA whitelabel HTML design to allow you to log issues, fork and submit pull requests in case you want to notify us of changes you would like to see. 


Support
---------------
At SDL we take your investment in Digital Experience very seriously, if you encounter any issues with the Digital Experience Accelerator, please use one of the following channels:

- Report issues directly in [this repository](https://github.com/sdl/dxa-html-design/issues)
- Ask questions 24/7 on the SDL Tridion Community at https://tridion.stackexchange.com
- Contact SDL Professional Services for DXA release management support packages to accelerate your support requirements


Documentation
-------------
Documentation can be found online in the SDL documentation portal: http://docs.sdl.com/sdldxa


Repositories
------------
The following repositories with source code are available:

 - https://github.com/sdl/dxa-content-management - Core Template Building Blocks
 - https://github.com/sdl/dxa-html-design - Whitelabel HTML Design
 - https://github.com/sdl/dxa-model-service - Model Service (Java)
 - https://github.com/sdl/dxa-modules - Modules (.NET and Java)
 - https://github.com/sdl/dxa-web-application-dotnet - ASP.NET MVC web application (including framework)
 - https://github.com/sdl/dxa-web-application-java - Java Spring MVC web application (including framework)


Branches and Contributions
--------------------------
We are using the following branching strategy:

 - `master` - Represents the latest stable version. This may be a pre-release version (tagged as `DXA x.y Sprint z`). Updated each development Sprint (approximately bi-weekly).
 - `develop` - Represents the latest development version. Updated very frequently (typically nightly).
 - `release/x.y` - Represents the x.y Release. If hotfixes are applicable, they will be applied to the appropriate release branch so that the branch actually represents the initial release plus hotfixes.

All releases (including pre-releases and hotfix releases) are tagged. 

If you wish to submit a Pull Request, it should normally be submitted on the `develop` branch so that it can be incorporated in the upcoming release.

Fixes for severe/urgent issues (that qualify as hotfixes) should be submitted as Pull Requests on the appropriate release branch.

Always submit an issue for the problem, and indicate whether you think it qualifies as a hotfix. Pull Requests on release branches will only be accepted after agreement on the severity of the issue.
Furthermore, Pull Requests on release branches are expected to be extensively tested by the submitter.

Of course, it is also possible (and appreciated) to report an issue without associated Pull Requests.

Build Whitelabel HTML Design
-----------------------
If you want to build the Whitelabel Design, please refer to the [following instructions](BUILD.md).

License
-------
Copyright (c) 2014-2020 SDL Group.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

	http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
