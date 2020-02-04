/*
 * MIT License
 *
 * Copyright (c) 2020 usmanager
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import Proposals from "../views/proposals/Proposals"
import ProposalDetails from "../views/proposals/ProposalDetails"
import Users from "../views/users/Users"
import UserDetails from "../views/users/UserDetails"
import Companies from "../views/companies/Companies"
import CompanyDetails from "../views/companies/CompanyDetails"
import Profile from "../views/profile/Profile.tsx"
import MyActivity from "../views/myActivity/MyActivity.tsx"

const routes = [
    {
        component: Proposals,
        name: "Propostas",
        path: "/proposals",
    },
    {
        component: ProposalDetails,
        name: "Detalhes da Proposta",
        path: "/proposals/:id/details",
    },
    {
        component: Users,
        name: "Utilizadores",
        path: "/users",
    },
    {
        component: UserDetails,
        name: "Detalhes do Utilizador",
        path: "/users/:id/details",
    },
    {
        component: Companies,
        name: "Companhias",
        path: "/companies",
    },
    {
        component: CompanyDetails,
        name: "Detalhes da Companhia",
        path: "/companies/:id/details",
    },
    {
        component: Profile,
        name: "Perfil",
        path: "/profile",
    },
    {
        component: MyActivity,
        name: "A minha atividade",
        path: "/myActivity",
    },
    { redirect: true, path: "/", to: "/login", name: "Redirect" }
];

export default routes;
