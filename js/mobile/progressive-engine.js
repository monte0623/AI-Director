/*
========================================================
AI Director Assistant
V10 Foundation-R1
Package-4
Release-001

File:
js/mobile/progressive-engine.js

Architecture:
Mobile Progressive Workspace Engine

Depends:
event-bus.js
workspace-state.js
workspace-lifecycle.js
workspace-registry.js

Status:
Foundation Stable
========================================================
*/

(function(global){

    "use strict";

    if(!global.AIDirector){
        global.AIDirector = {};
    }

    if(!global.AIDirector.Mobile){
        global.AIDirector.Mobile = {};
    }

    class ProgressiveWorkspaceEngine {

        constructor(){

            //----------------------------------------
            // Stage Definition
            //----------------------------------------

            this.stages = [

                {
                    id:0,
                    top:"script",
                    bottom:"scene"
                },

                {
                    id:1,
                    top:"scene",
                    bottom:"shot"
                },

                {
                    id:2,
                    top:"shot",
                    bottom:"detail"
                },

                {
                    id:3,
                    top:"detail",
                    bottom:"storyboard"
                },

                {
                    id:4,
                    top:"storyboard",
                    bottom:"shooting"
                }
            ];

            //----------------------------------------
            // Current
            //----------------------------------------

            this.currentStage = 0;

            //----------------------------------------
            // Container
            //----------------------------------------

            this.container = null;

            this.topContainer = null;

            this.bottomContainer = null;

            //----------------------------------------
            // Scroll
            //----------------------------------------

            this.lastScroll = 0;

            this.isTransitioning = false;
        }

        //----------------------------------------
        // Initialize
        //----------------------------------------

        initialize(container){

            this.container = container;

            this.build();

            this.bindEvents();

            this.gotoStage(0);

            this.emit(
                "mobile.initialized"
            );
        }

        //----------------------------------------
        // Build
        //----------------------------------------

        build(){

            this.container.innerHTML = `

                <div
                    id="mobile-top"
                    class="mobile-workspace top">
                </div>

                <div
                    id="mobile-divider">
                </div>

                <div
                    id="mobile-bottom"
                    class="mobile-workspace bottom">
                </div>
            `;

            this.topContainer =
                document.getElementById(
                    "mobile-top"
                );

            this.bottomContainer =
                document.getElementById(
                    "mobile-bottom"
                );
        }

        //----------------------------------------
        // Stage
        //----------------------------------------

        gotoStage(stageId){

            if(
                stageId < 0 ||
                stageId >=
                this.stages.length
            ){
                return;
            }

            this.currentStage =
                stageId;

            const stage =
                this.stages[
                    stageId
                ];

            this.renderWorkspace(
                this.topContainer,
                stage.top
            );

            this.renderWorkspace(
                this.bottomContainer,
                stage.bottom
            );

            global
                .AIDirector
                .Workspace
                .State
                .setMobileStage(
                    stageId,
                    stage.top,
                    stage.bottom
                );

            this.emit(
                "mobile.stage.changed",
                stage
            );
        }

        //----------------------------------------
        // Next
        //----------------------------------------

        next(){

            if(
                this.currentStage >=
                this.stages.length-1
            ){
                return;
            }

            this.gotoStage(
                this.currentStage+1
            );
        }

        //----------------------------------------
        // Previous
        //----------------------------------------

        previous(){

            if(
                this.currentStage <= 0
            ){
                return;
            }

            this.gotoStage(
                this.currentStage-1
            );
        }

        //----------------------------------------
        // Progressive Move
        //----------------------------------------

        progressiveForward(){

            const current =
                this.stages[
                    this.currentStage
                ];

            const next =
                this.stages[
                    this.currentStage+1
                ];

            if(!next){
                return;
            }

            this.animateTransition(
                current.bottom,
                next.bottom
            );

            this.currentStage++;

            global
                .AIDirector
                .Workspace
                .State
                .setMobileStage(
                    this.currentStage,
                    next.top,
                    next.bottom
                );

            this.emit(
                "mobile.progress.forward",
                {
                    stage:
                        this.currentStage
                }
            );
        }

        //----------------------------------------
        // Progressive Back
        //----------------------------------------

        progressiveBack(){

            if(
                this.currentStage <= 0
            ){
                return;
            }

            this.currentStage--;

            const stage =
                this.stages[
                    this.currentStage
                ];

            this.renderWorkspace(
                this.topContainer,
                stage.top
            );

            this.renderWorkspace(
                this.bottomContainer,
                stage.bottom
            );

            this.emit(
                "mobile.progress.back",
                {
                    stage:
                        this.currentStage
                }
            );
        }

        //----------------------------------------
        // Render
        //----------------------------------------

        renderWorkspace(
            container,
            workspaceId
        ){

            container.innerHTML =

                `
                <div
                    class="mobile-title">

                    ${workspaceId.toUpperCase()}

                </div>

                <div
                    class="mobile-content"
                    data-workspace="${workspaceId}">
                </div>
                `;

            global
                .AIDirector
                .Workspace
                .Registry
                .show(
                    workspaceId
                );
        }

        //----------------------------------------
        // Animation
        //----------------------------------------

        animateTransition(
            top,
            bottom
        ){

            if(
                this.isTransitioning
            ){
                return;
            }

            this.isTransitioning =
                true;

            this.topContainer
                .style
                .transform =
                    "translateY(-100%)";

            setTimeout(()=>{

                this.renderWorkspace(
                    this.topContainer,
                    top
                );

                this.renderWorkspace(
                    this.bottomContainer,
                    bottom
                );

                this.topContainer
                    .style
                    .transform =
                        "";

                this.isTransitioning =
                    false;

            },300);
        }

        //----------------------------------------
        // Scroll Detect
        //----------------------------------------

        handleScroll(
            scrollY
        ){

            if(
                scrollY >
                this.lastScroll
            ){

                this.progressiveForward();
            }
            else{

                this.progressiveBack();
            }

            this.lastScroll =
                scrollY;
        }

        //----------------------------------------
        // Snapshot
        //----------------------------------------

        snapshot(){

            return {

                stage:
                    this.currentStage,

                timestamp:
                    Date.now()
            };
        }

        //----------------------------------------
        // Restore
        //----------------------------------------

        restore(
            snapshot
        ){

            this.gotoStage(
                snapshot.stage
            );

            this.emit(
                "mobile.restored"
            );
        }

        //----------------------------------------
        // Events
        //----------------------------------------

        bindEvents(){

            window
                .addEventListener(
                    "scroll",
                    ()=>{

                        this.handleScroll(
                            window.scrollY
                        );
                    }
                );
        }

        //----------------------------------------
        // EventBus
        //----------------------------------------

        emit(
            namespace,
            payload={}
        ){

            global
                .AIDirector
                .EventBus
                .emit(
                    namespace,
                    payload,
                    "ProgressiveEngine"
                );
        }
    }

    global
        .AIDirector
        .Mobile
        .Progressive =
            new ProgressiveWorkspaceEngine();

})(window);
