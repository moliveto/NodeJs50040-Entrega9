const { Router } = require("express");
const passport = require("passport");
const userModel = require("../model/user.model");
const { createHash, isValidPasswd } = require("../utils/encrypt");

const router = Router();

router.get("/logout", async (req, res) => {
  req.session.destroy((err) => {
    if (!err) return res.redirect("/login");
    return res.send({ message: `logout Error`, body: err });
  });
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const session = req.session;
    console.log(
      "file: session.routes.js:17 ~ router.post ~ session:",
      session
    );

    const findUser = await userModel.findOne({ email });

    if (!findUser) return res.json({ message: `user not register` });

    const isValidComparePsw = await isValidPasswd(password, findUser.password);

    if (!isValidComparePsw) {
      return res.json({ message: `wrong password` });
    }

    const { first_name, last_name, age, role } = findUser;

    const sessionUser = {
      first_name,
      last_name,
      email,
      age,
      role
    };

    req.session.user = sessionUser;

    return res.render("profile", {
      firstName: req.session?.user?.first_name || findUser.first_name,
      lastName: req.session?.user?.last_name || findUser.last_name,
      email: req.session?.user?.email || email,
      age: req.session?.user?.age || findUser.age,
      role: req.session?.user?.role || findUser.role
    });
  } catch (error) {
    console.log(
      "file: session.routes.js:42 ~ router.post ~ error:",
      error
    );
  }
});

router.post("/register", async (req, res) => {
  try {
    console.log("BODY REGISTER***", req.body);
    const { first_name, last_name, email, age, password, role } = req.body;

    const pswHashed = await createHash(password);

    const addUser = {
      first_name,
      last_name,
      email,
      age,
      password: pswHashed,
      role
    };

    const newUser = await userModel.create(addUser);

    if (!newUser) {
      return res
        .status(500)
        .json({ message: `we have some issues register this user` });
    }

    // session del usuario
    req.session.user = { email, firstName: first_name, lastName: last_name, role };
    return res.redirect("/login");
  } catch (error) {
    // atrapa todos los reject de todas las promesas
    console.log(
      "file: session.routes.js:41 ~ router.post ~ error:",
      error
    );
  }
});

router.post("/recover-psw", async (req, res) => {
  try {
    const { new_password, email } = req.body;
    console.log(
      "🚀 ~ file: session.routes.js:93 ~ router.post ~ req.body:",
      req.body
    );

    const newPswHash = await createHash(new_password);
    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ message: `credenciales invalidas o erroneas` });
    }

    const updateUser = await userModel.findByIdAndUpdate(user._id, {
      password: newPswHash,
    });

    if (!updateUser) {
      return res.json({ message: "problemas actualizando la contrasena" });
    }

    return res.render("login");
  } catch (error) {
    console.log(
      "🚀 ~ file: session.routes.js:114 ~ router.post ~ error:",
      error
    );
  }
});

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => { }
);

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    try {
      req.session.user = req.user;
      res.redirect("/profile");
    } catch (error) {
      console.log("🚀 ~ file: session.routes.js:115 ~ error:", error);
    }
  }
);

module.exports = router;
