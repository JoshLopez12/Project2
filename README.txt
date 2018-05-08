Josh Lopez and Nathan Hauk

Project 2: Interactive 3D Home Office

Description:
This project shows a realistic scene of a home office, with a desk, chair, and computer tower, displayed using a perspective projection. The user can interact with the chair by having it move along the desk to the left or right with Z/X. There are two lights in the scene, both creating a specular reflection on the pieces. Each piece has a distinct texture. 

Implementation:
Multiple polyhedra were created to make the 3 distinct pieces (chair, desk, computer) in this scene. Models were created in MeshLab and exported to .obj and .mtl files, which were used in the OBJLoader function to create the arrays for the vertices, indices, vertex normals, and texture coordinates for each piece. Each piece uses its own ShaderProgram, vertex shader, and fragment shader - this allows for each piece to have a modelview matrix, perspective projection matrix, and texture.  

The functions in the .js file work as follows:

init(): initializes the shader programs and creates the arrays to define the chair, desk, and computer models

drawObject(): calls functions to set up buffers for chair, desk, and computer

setupTableBuffer(): creates buffers, defines modelview matrix, perspective projection matrix, coefficients for lights 1 and 2, and texture for the desk

setupChairBuffer(): creates buffers, defines modelview matrix, perspective projection matrix, coefficients for lights 1 and 2, and texture for the chair

setupDesktopBuffer(): creates buffers, defines modelview matrix, perspective projection matrix, coefficients for lights 1 and 2, and texture for the computer

transform( event ): calls transX_func() or negative_transX_func() depending on if Z/X is pressed

transX_func(): creates a positive translation for the chair

negative_transX_func(): creates a negative translation for the chair

configureTexture( image ): function to set up texture information, used by chair, desk, and computer buffers