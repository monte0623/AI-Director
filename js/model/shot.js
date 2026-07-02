/*
========================================================
AI Director Assistant
V10 Foundation-R1
Package-1
Release-005

File:
js/model/shot.js

Architecture:
Shot Domain

Depends:
domain-base.js
event-bus.js

Status:
Foundation Stable
========================================================
*/

(function(global){

    "use strict";

    if(!global.AIDirector){
        global.AIDirector = {};
    }

    if(!global.AIDirector.Model){
        global.AIDirector.Model = {};
    }

    const DomainObject =
        global.AIDirector
            .Model
            .DomainObject;

    //------------------------------------------------
    // Priority
    //------------------------------------------------

    const ShotPriority = {

        CRITICAL : "critical",
        HIGH     : "high",
        NORMAL   : "normal",
        LOW      : "low"
    };

    //------------------------------------------------
    // Status
    //------------------------------------------------

    const ShotStatus = {

        DRAFT     : "draft",
        PLANNED   : "planned",
        READY     : "ready",
        SHOOTING  : "shooting",
        OK        : "ok",
        NG        : "ng",
        COMPLETE  : "complete"
    };

    //------------------------------------------------
    // Horizontal
    //------------------------------------------------

    class HorizontalSetup {

        constructor(){

            this.enable = true;

            this.ratio = "16:9";

            this.resolution = "3840x2160";

            this.cameraRef = "";

            this.lens = "";

            this.fps = 24;

            this.lut = "";

            this.notes = "";
        }
    }

    //------------------------------------------------
    // Vertical
    //------------------------------------------------

    class VerticalSetup {

        constructor(){

            this.enable = true;

            this.ratio = "9:16";

            this.resolution = "2160x3840";

            this.cameraRef = "";

            this.lens = "";

            this.fps = 24;

            this.lut = "";

            this.notes = "";
        }
    }

    //------------------------------------------------
    // Shot
    //------------------------------------------------

    class Shot extends DomainObject {

        constructor(
            internalId = "SHT-" + Date.now(),
            displayId = "S00-000"
        ){

            super(
                internalId,
                displayId
            );

            //----------------------------------------
            // Basic
            //----------------------------------------

            this.shotNo = "";

            this.shotName = "";

            this.description = "";

            //----------------------------------------
            // Camera
            //----------------------------------------

            this.size = "";

            this.angle = "";

            this.height = "";

            this.movement = "";

            this.lens = "";

            this.camera = "";

            //----------------------------------------
            // Production
            //----------------------------------------

            this.actors = [];

            this.props = [];

            this.costumes = [];

            //----------------------------------------
            // Shooting
            //----------------------------------------

            this.duration = 0;

            this.priority =
                ShotPriority.NORMAL;

            this.status =
                ShotStatus.DRAFT;

            //----------------------------------------
            // Notes
            //----------------------------------------

            this.notes = "";

            //----------------------------------------
            // Horizontal
            //----------------------------------------

            this.horizontal =
                new HorizontalSetup();

            //----------------------------------------
            // Vertical
            //----------------------------------------

            this.vertical =
                new VerticalSetup();

            //----------------------------------------
            // Relations
            //----------------------------------------

            this.sceneRefs = [];

            this.sequenceRefs = [];

            this.cameraRefs = [];

            this.storyboardRef = "";

            this.blockingRef = "";

            this.shootingRef = "";

            //----------------------------------------
            // Workspace
            //----------------------------------------

            this.selected = false;

            this.expanded = false;
        }

        //----------------------------------------
        // Update
        //----------------------------------------

        updateShot(
            data = {}
        ){

            this.update(data);

            this.emit(
                "shot.updated",
                {
                    shotId:
                        this.internalId
                }
            );
        }

        //----------------------------------------
        // Scene
        //----------------------------------------

        addScene(
            sceneId
        ){

            if(
                !this.sceneRefs
                    .includes(sceneId)
            ){

                this.sceneRefs
                    .push(sceneId);

                this.emit(
                    "shot.linked.scene",
                    {
                        shotId:
                            this.internalId,
                        sceneId
                    }
                );
            }
        }

        removeScene(
            sceneId
        ){

            this.sceneRefs =
                this.sceneRefs.filter(
                    id =>
                        id !== sceneId
                );

            this.emit(
                "shot.unlinked.scene",
                {
                    shotId:
                        this.internalId,
                    sceneId
                }
            );
        }

        //----------------------------------------
        // Sequence
        //----------------------------------------

        addSequence(
            sequenceId
        ){

            if(
                !this.sequenceRefs
                    .includes(sequenceId)
            ){

                this.sequenceRefs
                    .push(sequenceId);

                this.emit(
                    "shot.linked.sequence",
                    {
                        shotId:
                            this.internalId,
                        sequenceId
                    }
                );
            }
        }

        removeSequence(
            sequenceId
        ){

            this.sequenceRefs =
                this.sequenceRefs.filter(
                    id =>
                        id !== sequenceId
                );

            this.emit(
                "shot.unlinked.sequence",
                {
                    shotId:
                        this.internalId,
                    sequenceId
                }
            );
        }

        //----------------------------------------
        // Camera
        //----------------------------------------

        addCamera(
            cameraId
        ){

            if(
                !this.cameraRefs
                    .includes(cameraId)
            ){

                this.cameraRefs
                    .push(cameraId);

                this.emit(
                    "shot.linked.camera",
                    {
                        shotId:
                            this.internalId,
                        cameraId
                    }
                );
            }
        }

        removeCamera(
            cameraId
        ){

            this.cameraRefs =
                this.cameraRefs.filter(
                    id =>
                        id !== cameraId
                );

            this.emit(
                "shot.unlinked.camera",
                {
                    shotId:
                        this.internalId,
                        cameraId
                }
            );
        }

        //----------------------------------------
        // Storyboard
        //----------------------------------------

        setStoryboard(
            storyboardId
        ){

            this.storyboardRef =
                storyboardId;

            this.emit(
                "shot.linked.storyboard",
                {
                    shotId:
                        this.internalId,
                    storyboardId
                }
            );
        }

        //----------------------------------------
        // Blocking
        //----------------------------------------

        setBlocking(
            blockingId
        ){

            this.blockingRef =
                blockingId;

            this.emit(
                "shot.linked.blocking",
                {
                    shotId:
                        this.internalId,
                    blockingId
                }
            );
        }

        //----------------------------------------
        // Shooting
        //----------------------------------------

        setShooting(
            shootingId
        ){

            this.shootingRef =
                shootingId;

            this.emit(
                "shot.linked.shooting",
                {
                    shotId:
                        this.internalId,
                    shootingId
                }
            );
        }

        //----------------------------------------
        // Status
        //----------------------------------------

        setStatus(
            status
        ){

            this.status =
                status;

            this.updatedAt =
                Date.now();

            this.emit(
                "shot.updated",
                {
                    shotId:
                        this.internalId,
                    status
                }
            );
        }

        //----------------------------------------
        // Workspace
        //----------------------------------------

        select(){

            this.selected = true;

            this.emit(
                "shot.selected",
                {
                    shotId:
                        this.internalId
                }
            );
        }

        unselect(){

            this.selected = false;

            this.emit(
                "shot.unselected",
                {
                    shotId:
                        this.internalId
                }
            );
        }

        expand(){

            this.expanded = true;

            this.emit(
                "workspace.expand",
                {
                    shotId:
                        this.internalId
                }
            );
        }

        collapse(){

            this.expanded = false;

            this.emit(
                "workspace.collapse",
                {
                    shotId:
                        this.internalId
                }
            );
        }

        //----------------------------------------
        // Validation
        //----------------------------------------

        validate(){

            return (
                this.internalId &&
                this.displayId
            );
        }

        //----------------------------------------
        // Serialize
        //----------------------------------------

        serialize(){

            return {

                ...super.serialize(),

                shotNo:
                    this.shotNo,

                shotName:
                    this.shotName,

                description:
                    this.description,

                size:
                    this.size,

                angle:
                    this.angle,

                height:
                    this.height,

                movement:
                    this.movement,

                lens:
                    this.lens,

                camera:
                    this.camera,

                actors:
                    [...this.actors],

                props:
                    [...this.props],

                costumes:
                    [...this.costumes],

                duration:
                    this.duration,

                priority:
                    this.priority,

                status:
                    this.status,

                notes:
                    this.notes,

                horizontal:
                    structuredClone(
                        this.horizontal
                    ),

                vertical:
                    structuredClone(
                        this.vertical
                    ),

                sceneRefs:
                    [...this.sceneRefs],

                sequenceRefs:
                    [...this.sequenceRefs],

                cameraRefs:
                    [...this.cameraRefs],

                storyboardRef:
                    this.storyboardRef,

                blockingRef:
                    this.blockingRef,

                shootingRef:
                    this.shootingRef
            };
        }
    }

    global
        .AIDirector
        .Model
        .Shot =
        Shot;

    global
        .AIDirector
        .Model
        .ShotPriority =
        ShotPriority;

    global
        .AIDirector
        .Model
        .ShotStatus =
        ShotStatus;

})(window);
