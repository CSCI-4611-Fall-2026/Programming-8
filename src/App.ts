/* Programming 8
 * CSCI 4611, Fall 2026, University of Minnesota
 * Instructor: Evan Suma Rosenberg <suma@umn.edu>
 * License: Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 */ 

import * as gfx from 'gophergfx'

export class App extends gfx.GfxApp
{
    private cylinder: gfx.Mesh3;
    private cameraControls: gfx.OrbitControls;

    // --- Create the App class ---
    constructor()
    {
        // initialize the base class gfx.GfxApp
        super();

        this.cameraControls = new gfx.OrbitControls(this.camera);
        this.cylinder = new gfx.Mesh3();
    }


    // --- Initialize the graphics scene ---
    createScene(): void 
    {
        // Setup the camera projection matrix and position.
        this.camera.setPerspectiveCamera(60, 1920/1080, 0.1, 10);

        this.cameraControls.setDistance(5);
        this.cameraControls.setOrbit(gfx.MathUtils.degreesToRadians(-22.5), 0);

        // Add an axes helper to the scene
        const axes = gfx.Geometry3Factory.createAxes();
        this.scene.add(axes);

        // Create an ambient light
        const ambientLight = new gfx.AmbientLight(new gfx.Color(0.5, 0.5, 0.5));
        this.scene.add(ambientLight);

        // Create a directional light
        const directionalLight = new gfx.DirectionalLight(new gfx.Color(0.5, 0.5, 0.5));
        directionalLight.position.set(-2, 1, 0)
        this.scene.add(directionalLight);

        // Create a material for the cylinder that interacts with the lights in the scene
        const cylinderMaterial = new gfx.PhongMaterial();
        cylinderMaterial.diffuseColor = new gfx.Color(1, 1, 1);
        this.cylinder.material = cylinderMaterial;

        // Create a cylinder mesh with 32 segments and a height of 2.5 units
        this.createCylinderMesh(this.cylinder, 32, 2.5);
        //this.cylinder.material = new gfx.WireframeMaterial();
        //this.cylinder.material.side = gfx.Side.DOUBLE;

        // Rotate the cylinder so the label is facing towards the camera
        this.cylinder.rotation.setRotationY(gfx.MathUtils.degreesToRadians(90));

        // Add the cylinder to the scene
        this.scene.add(this.cylinder);
    }

    
    // --- Update is called once each frame by the main graphics loop ---
    update(deltaTime: number): void 
    {
       this.cameraControls.update(deltaTime);
    }

    private createCylinderMesh(mesh: gfx.Mesh3, numSegments: number, height: number)
    {
        // Create the vertices, normals, and indices for the cylinder mesh.
        const vertices: gfx.Vector3[] = [];
        const normals: gfx.Vector3[] = [];
        const indices: number[] = [];

        // Calculate the angle increment for each segment of the cylinder.
        const angleIncrement = (Math.PI * 2) / numSegments;

        // Create the barrel of the cylinder with outward-facing normals.
        for(let i=0; i <= numSegments; i++)
        {
            const angle = i * angleIncrement;

            // Create two vertices that make up each column
            vertices.push(new gfx.Vector3(Math.cos(angle), height/2, Math.sin(angle)));
            vertices.push(new gfx.Vector3(Math.cos(angle), -height/2, Math.sin(angle)));
        
            // Create two normals that make up each column
            normals.push(new gfx.Vector3(Math.cos(angle), 0, Math.sin(angle)));
            normals.push(new gfx.Vector3(Math.cos(angle), 0, Math.sin(angle)));
        }

        // Create the indices for the barrel of the cylinder.
        for(let i=0; i < numSegments; i++)
        {
            indices.push(i*2, i*2+2, i*2+1);
            indices.push(i*2+1, i*2+2, i*2+3);
        }

        // Create the center vertex for the top disc and add it to the vertices and normals arrays.
        const topCenter = vertices.length;
        vertices.push(new gfx.Vector3(0, height/2, 0));
        normals.push(new gfx.Vector3(0, 1, 0));

        // Create the top disc with upward-facing normals.
        const topStart = vertices.length;
        for(let i=0; i <= numSegments; i++)
        {
            const angle = i * angleIncrement;

            vertices.push(new gfx.Vector3(Math.cos(angle), height/2, Math.sin(angle)));
            normals.push(new gfx.Vector3(0, 1, 0));
        }

        // Create the indices for the top disc.
        for(let i=0; i < numSegments; i++)
        {
            indices.push(topCenter, topStart+i+1, topStart+i);
        }

        // Create the center vertex for the bottom disc and add it to the vertices and normals arrays.
        const bottomCenter = vertices.length;
        vertices.push(new gfx.Vector3(0, -height/2, 0));
        normals.push(new gfx.Vector3(0, -1, 0));

        // Create the bottom disc with downward-facing normals.
        const bottomStart = vertices.length;
        for(let i=0; i <= numSegments; i++)
        {
            const angle = i * angleIncrement;

            vertices.push(new gfx.Vector3(Math.cos(angle), -height/2, Math.sin(angle)));
            normals.push(new gfx.Vector3(0, -1, 0));
        }

        // Create the indices for the bottom disc.
        for(let i=0; i < numSegments; i++)
        {
            // Reverse the winding so these triangles face downward.
            indices.push(bottomCenter, bottomStart+i, bottomStart+i+1);
        }

        // Set the vertices, normals, and indices for the mesh.
        mesh.setVertices(vertices);
        mesh.setNormals(normals);
        mesh.setIndices(indices);
    }
}
