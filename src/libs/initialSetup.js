import Rol from "../models/Rol";
import User from "../models/User";

export const createRoles = async () => {
    try {
        // contar documentos
        const count = await Rol.estimatedDocumentCount();

        if (count > 0) return;

        // create default roles
        const values = await Promise.all([
            new Rol({ name: "admin"}).save(),
            new Rol({ name: "moderador"}).save()
        ])
    } catch (error) {
        console.log(error);
    }
}

export const createAdmin = async () => {
    const userFound = await User.findOne({ username: "admin" });
    
    if (userFound) return;

    // obtener roles por id
    const roles = await Rol.find({ name: { $in: ["admin"] }});

    // creador un nuevo administrador
    const newUser = await User.create({
        username: "admin",
        password: "superadmin",
        roles: roles.map((role) => role._id)
    });

    console.log(`nuevo Usuario creado ${newUser}`);
}

createRoles();
createAdmin();