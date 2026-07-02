/*
========================================================
AI Director Assistant
V10 Foundation-R1
Package-6
Release-005

File:
js/app.js

Architecture:
Application Bootstrap

Status:
Foundation Stable
========================================================
*/

(function(global){

    "use strict";

    class AIDirectorApplication {

        constructor(){

            this.platform = null;

            this.project = null;

            this.initialized = false;
        }

        //------------------------------------
        // Start
        //------------------------------------

        async start(){

            try{

                this.emit(
                    "app.start"
                );

                await this.initializeProject();

                this.detectPlatform();

                await this.initializeWorkspace();

                await this.initializeUI();

                await this.restore();

                this.hideSplash();

                this.initialized =
                    true;

                this.emit(
                    "app.ready"
                );
            }
            catch(error){

                console.error(
                    error
                );

                this.emit(
                    "app.error",
                    {
                        error
                    }
                );
            }
        }

        //------------------------------------
        // Project
        //------------------------------------

        async initializeProject(){

            if(
                !global
                    .AIDirector
                    .ProjectStore
            ){
                return;
            }

            let project =
                global
                    .AIDirector
                    .ProjectStore
                    .getProject();

            if(
                !project
            ){

                project =
                    new global
                        .AIDirector
                        .Model
                        .Project(
                            crypto
                                .randomUUID(),
                            "New Project"
                        );

                global
                    .AIDirector
                    .ProjectStore
                    .setProject(
                        project
                    );
            }

            this.project =
                project;

            this.emit(
                "project.loaded",
                {
                    project
                }
            );
        }

        //------------------------------------
        // Platform
        //------------------------------------

        detectPlatform(){

            const width =
                window.innerWidth;

            const touch =
                (
                    "ontouchstart"
                    in window
                );

            if(
                touch &&
                width < 900
            ){

                this.platform =
                    "mobile";
            }
            else{

                this.platform =
                    "ipad";
            }

            this.emit(
                "platform.detected",
                {
                    platform:
                        this.platform
                }
            );
        }

        //------------------------------------
        // Workspace
        //------------------------------------

        async initializeWorkspace(){

            const registry =
                global
                    .AIDirector
                    .Workspace
                    .Registry;

            [
                "script",
                "scene",
                "shot",
                "detail",
                "storyboard",
                "shooting"
            ]
            .forEach(
                id => {

                    registry
                        .register(
                            id,
                            {
                                persistent:
                                    true
                            }
                        );
                }
            );

            this.emit(
                "workspace.ready"
            );
        }

        //------------------------------------
        // UI
        //------------------------------------

        async initializeUI(){

            if(
                this.platform ===
                "ipad"
            ){

                await this
                    .initializeIPad();
            }
            else{

                await this
                    .initializeMobile();
            }
        }

        //------------------------------------
        // iPad
        //------------------------------------

        async initializeIPad(){

            const root =
                document
                    .getElementById(
                        "ipadWorkspace"
                    );

            root.style.display =
                "flex";

            global
                .AIDirector
                .iPad
                .Engine
                .initialize(
                    root
                );

            global
                .AIDirector
                .iPad
                .Layout
                .initialize(
                    root
                );

            global
                .AIDirector
                .iPad
                .Focus
                .initialize();

            this.mountWorkspace();

            this.emit(
                "ipad.ready"
            );
        }

        //------------------------------------
        // Mobile
        //------------------------------------

        async initializeMobile(){

            const root =
                document
                    .getElementById(
                        "mobileWorkspace"
                    );

            root.style.display =
                "block";

            global
                .AIDirector
                .Mobile
                .Progressive
                .initialize(
                    root
                );

            global
                .AIDirector
                .Mobile
                .Snap
                .initialize(
                    root
                );

            global
                .AIDirector
                .Mobile
                .Ratio
                .initialize();

            this.mountWorkspace();

            this.emit(
                "mobile.ready"
            );
        }

        //------------------------------------
        // Mount
        //------------------------------------

        mountWorkspace(){

            const workspace =

            [
                {
                    id:"script",
                    ui:
                        global
                            .AIDirector
                            .WorkspaceUI
                            .Script
                },

                {
                    id:"scene",
                    ui:
                        global
                            .AIDirector
                            .WorkspaceUI
                            .Scene
                },

                {
                    id:"shot",
                    ui:
                        global
                            .AIDirector
                            .WorkspaceUI
                            .Shot
                },

                {
                    id:"detail",
                    ui:
                        global
                            .AIDirector
                            .WorkspaceUI
                            .Detail
                },

                {
                    id:"storyboard",
                    ui:
                        global
                            .AIDirector
                            .WorkspaceUI
                            .Storyboard
                },

                {
                    id:"shooting",
                    ui:
                        global
                            .AIDirector
                            .WorkspaceUI
                            .Shooting
                }
            ];

            workspace
                .forEach(
                    item=>{

                        const panel =
                            document
                                .querySelector(
                                    `[data-workspace="${item.id}"] .panel-content`
                                );

                        if(
                            panel
                            &&
                            item.ui
                        ){

                            item.ui
                                .initialize(
                                    panel
                                );
                        }
                    }
                );

            this.emit(
                "workspace.mounted"
            );
        }

        //------------------------------------
        // Restore
        //------------------------------------

        async restore(){

            try{

                global
                    .AIDirector
                    .iPad
                    ?.Layout
                    ?.load?.();

                global
                    .AIDirector
                    .iPad
                    ?.Engine
                    ?.load?.();

                global
                    .AIDirector
                    .Mobile
                    ?.Ratio
                    ?.load?.();

                this.emit(
                    "session.restored"
                );
            }
            catch(e){

                console.warn(
                    e
                );
            }
        }

        //------------------------------------
        // Splash
        //------------------------------------

        hideSplash(){

            const splash =
                document
                    .getElementById(
                        "app-splash"
                    );

            if(
                !splash
            ){
                return;
            }

            splash.style.opacity =
                "0";

            setTimeout(()=>{

                splash.remove();

            },300);
        }

        //------------------------------------
        // EventBus
        //------------------------------------

        emit(
            namespace,
            payload={}
        ){

            global
                .AIDirector
                .EventBus
                ?.emit(
                    namespace,
                    payload,
                    "Application"
                );
        }
    }

    //------------------------------------
    // Bootstrap
    //------------------------------------

    document
        .addEventListener(
            "DOMContentLoaded",
            ()=>{

                global
                    .AIDirector
                    .App =
                        new
                        AIDirectorApplication();

                global
                    .AIDirector
                    .App
                    .start();
            }
        );

})(window);
