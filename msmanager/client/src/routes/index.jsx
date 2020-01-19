import Login from "../views/login/Login";
import EcmaEvents from "../layouts/EcmaEvents.jsx";

const routes = [
    {
        component: Login,
        path: "/login"
    },
    {
        component: EcmaEvents,
        path: "/"
    }
];

export default routes
