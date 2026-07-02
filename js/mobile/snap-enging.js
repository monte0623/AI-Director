/*
========================================================
AI Director Assistant
V10 Foundation-R1
Package-4
Release-002

File:
js/mobile/snap-engine.js

Architecture:
Mobile Snap Engine

Depends:
event-bus.js
progressive-engine.js

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

    class MobileSnapEngine {

        constructor(){

            //----------------------------------------
            // Touch
            //----------------------------------------

            this.startY = 0;
            this.currentY = 0;
            this.endY = 0;

            //----------------------------------------
            // Velocity
            //----------------------------------------

            this.startTime = 0;
            this.endTime = 0;
            this.velocity = 0;

            //----------------------------------------
            // State
            //----------------------------------------

            this.isDragging = false;
            this.isSnapping = false;

            //----------------------------------------
            // Threshold
            //----------------------------------------

            this.snapDistance = 80;
            this.snapVelocity = 0.4;

            //----------------------------------------
            // Container
            //----------------------------------------

            this.container = null;
        }

        //----------------------------------------
        // Initialize
        //----------------------------------------

        initialize(container){

            this.container = container;

            this.bindTouch();

            this.emit(
                "mobile.snap.initialized"
            );
        }

        //----------------------------------------
        // Touch Start
        //----------------------------------------

        onTouchStart(e){

            if(this.isSnapping){
                return;
            }

            this.isDragging = true;

            this.startY =
                e.touches[0].clientY;

            this.currentY =
                this.startY;

            this.startTime =
                performance.now();

            this.emit(
                "mobile.snap.begin"
            );
        }

        //----------------------------------------
        // Touch Move
        //----------------------------------------

        onTouchMove(e){

            if(!this.isDragging){
                return;
            }

            this.currentY =
                e.touches[0].clientY;

            const delta =
                this.currentY -
                this.startY;

            this.preview(delta);
        }

        //----------------------------------------
        // Touch End
        //----------------------------------------

        onTouchEnd(){

            if(!this.isDragging){
                return;
            }

            this.endY =
                this.currentY;

            this.endTime =
                performance.now();

            const distance =
                this.endY -
                this.startY;

            const duration =
                this.endTime -
                this.startTime;

            this.velocity =
                Math.abs(
                    distance /
                    Math.max(
                        duration,
                        1
                    )
                );

            this.evaluate(
                distance,
                this.velocity
            );

            this.isDragging =
                false;
        }

        //----------------------------------------
        // Evaluate
        //----------------------------------------

        evaluate(
            distance,
            velocity
        ){

            const progressive =
                global
                    .AIDirector
                    .Mobile
                    .Progressive;

            if(
                Math.abs(
                    distance
                ) <
                this.snapDistance
                &&
                velocity <
                this.snapVelocity
            ){

                this.restore();

                return;
            }

            this.isSnapping =
                true;

            global
                .AIDirector
                .Workspace
                .State
                .startSnap();

            if(distance < 0){

                progressive
                    .progressiveForward();
            }
            else{

                progressive
                    .progressiveBack();
            }

            setTimeout(()=>{

                this.isSnapping =
                    false;

                global
                    .AIDirector
                    .Workspace
                    .State
                    .endSnap();

            },300);
        }

        //----------------------------------------
        // Preview
        //----------------------------------------

        preview(
            delta
        ){

            const top =
                document.getElementById(
                    "mobile-top"
                );

            const bottom =
                document.getElementById(
                    "mobile-bottom"
                );

            if(
                !top ||
                !bottom
            ){
                return;
            }

            top.style.transform =
                `translateY(${delta/4}px)`;

            bottom.style.transform =
                `translateY(${delta/2}px)`;
        }

        //----------------------------------------
        // Restore
        //----------------------------------------

        restore(){

            const top =
                document.getElementById(
                    "mobile-top"
                );

            const bottom =
                document.getElementById(
                    "mobile-bottom"
                );

            if(top){
                top.style.transform =
                    "";
            }

            if(bottom){
                bottom.style.transform =
                    "";
            }

            this.emit(
                "mobile.snap.restore"
            );
        }

        //----------------------------------------
        // Force Snap
        //----------------------------------------

        snapForward(){

            global
                .AIDirector
                .Mobile
                .Progressive
                .progressiveForward();

            this.emit(
                "mobile.snap.forward"
            );
        }

        //----------------------------------------
        // Force Back
        //----------------------------------------

        snapBack(){

            global
                .AIDirector
                .Mobile
                .Progressive
                .progressiveBack();

            this.emit(
                "mobile.snap.back"
            );
        }

        //----------------------------------------
        // Snapshot
        //----------------------------------------

        snapshot(){

            return {

                timestamp:
                    Date.now(),

                startY:
                    this.startY,

                currentY:
                    this.currentY,

                velocity:
                    this.velocity
            };
        }

        //----------------------------------------
        // Restore Snapshot
        //----------------------------------------

        restoreSnapshot(
            snapshot
        ){

            this.startY =
                snapshot.startY;

            this.currentY =
                snapshot.currentY;

            this.velocity =
                snapshot.velocity;

            this.emit(
                "mobile.snap.restored"
            );
        }

        //----------------------------------------
        // Bind
        //----------------------------------------

        bindTouch(){

            if(!this.container){
                return;
            }

            this.container
                .addEventListener(
                    "touchstart",
                    e =>
                        this
                            .onTouchStart(
                                e
                            ),
                    {
                        passive:true
                    }
                );

            this.container
                .addEventListener(
                    "touchmove",
                    e =>
                        this
                            .onTouchMove(
                                e
                            ),
                    {
                        passive:true
                    }
                );

            this.container
                .addEventListener(
                    "touchend",
                    () =>
                        this
                            .onTouchEnd()
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
                    "MobileSnap"
                );
        }
    }

    global
        .AIDirector
        .Mobile
        .Snap =
            new MobileSnapEngine();

})(window);
