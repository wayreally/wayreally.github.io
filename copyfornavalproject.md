01 / System foundations
The Ship and the Sea
The first task I undertook in this project was to model my ship, a Ticonderoga Class guided missile cruiser. After I had my model I brought it into Roblox Studio and set up kinematics using a mathematical model of a wave surface to determine what the ship’s vertical coordinate should be at any point. On top of this the ship uses spring physics to mimic the natural motion of a ship atop a wave.
The second task was to design the ocean. I went through a few iterations, but I ultimately landed on rendering the ocean using triangle tiles. I achieved this by sampling my mathematical wave model at various points, and using these points as vertices to draw triangle tiles. The points  closer to the player’s ship are sampled more densely and updated faster; this allows me to avoid rendering the ocean on the server and optimize the ocean’s rendering for each client’s machine. 
(VIDEO OF OLD WAVE TECH FROM BOTTOM OF PAGE WITH NEON POINTS)
(VIDEO OF SQUARE WAVE TECH)

02 / A Floating Base
The Player is not the Ship
My second challenge was allowing the player to walk around the ship. In the Roblox engine every player inherits a character model, the player camera is attached to this model. My game makes the player model invisible and sticks them to the ship, making it appear as though the camera is orbiting about the ship itself. To integrate first person movement within the ship itself I had to create a new camera movement system, detaching the camera from the player camera and positioning it at a point in space within the ship. The WASD movement keys are rebound in first person view to move the position of this camera.

Once I had the camera set up I had to deal with collisions, stairs and doors. Rather than calculating collisions by using the imported model of the 3D ship I created simple collision part volumes covering all surfaces on the ship, these serve as the actual collision model for the ship. This is much less computationally expensive and allows me more freedom when fixing collision bugs.

(Video of player movement pre-colission)
(video of player movement post-collision)

03 / Weapons Systems
The Fun Part
The third thing I integrated was weapon systems. The Ticonderoga class utilizes a number of weapons, most important are the Mark 41 Vertical Launching System, Mark 45 5 inch guns, and Phalanx CIWS system. While the Ticonderoga does have additional armaments, these were the first to be integrated into my game. In order to get weapons functional I had to first develop a radar targeting system. My system uses simple raycasts to determine what it can see, and renders raycast end points to the player in a rudimentary terrain detection system. If the raycast can see an enemy the enemy is shown on the radar, and can be targeted. By checking the coordinates of a targeted ship I can calculate the angle of the mount in order to orient the gun, and the ballistic trajectory to change the elevation. Firing the gun moves a bullet part along that trajectory, causing damage to a ship if it makes contact. 

A bullet fired in our system is just a part with special properties, a missile is a little bit more complicated. A missile is its own entity like a ship, it has an identity and a radar signature. This allows players to monitor their own missiles and detect incoming missiles using radar. This becomes very important when we want our CIWS system to track and shoot down missiles. The missile firing system queries the radar in the same way the gun system does, once it obtains the coordinates of the target it calculates a trajectory and follows it. Having the missile obtain target info from the radar allows us to integrate electronic warfare systems like jammers later on.

With these two systems in place setting up CIWS was just a matter of leveraging my existing gun orientation code and doing some simple rigging on my CIWS model.

(Video of gun firing and slewing)
(Video of missile firing)


04 / Details
Interior Spaces Give the Ship Life
Once I had the basic systems in place it was time to go to work detailing the interiors. First I gave the ship a cargo hold and a boiler room. Doing repairs in the boiler room costs supplies, represented by stacked boxes in the cargo hold. This hold is also intended to house a helicopter in later versions. Working in this confined space was made much easier by using my collision volumes; calculating collisions from complex 3D models is buggy and computationally expensive, especially when doing interiors. This was also a stress test for my door system, and a chance to make some changes to the rendering engine so water doesn’t render inside the cargo hold.

After tackling the cargo hold and boiler room I remodeled the interior of the Bridge. Designing the bridge ended up being more than just a modeling job, the bridge should be the central gameplay location for the ship’s crew, I needed to make it visually appealing and functional. I ended up with a 3 console bridge, space for a captain, an electronic warfare specialist, and a weapons specialist. After modeling the bridge I made the screens interactive, allowing the captain to fully drive and utilize the radar in first person. 

(VIDEO OF BRIDGE)
(VIDEO OF CARGO HOLD)
(VIDEO OF FAST MAKING)

05 / Sensor development
Making contact data readable and Jammable
Unsatisfied with my first person radar interaction I dove into a 3D radar representation. This view renders a 3D model of a radar space, complete with a radar field of view circle that conforms to blocking terrain. On this foundation I started building basic electronic warfare systems. The jammer floods a targeted area with radar noise, showing false positives on radars within the area and making effective targeting impossible. This affects both ships and missiles. 

This system is prettier, easier to interact with, and less computationally expensive than my previous 2D radar representations. Jammers and radar systems can also be damaged or knocked offline by successive hits. 

(Video of 3d radar)
