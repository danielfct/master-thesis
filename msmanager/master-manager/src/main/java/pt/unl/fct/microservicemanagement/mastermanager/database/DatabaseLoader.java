package pt.unl.fct.ciai.database;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import pt.unl.fct.ciai.model.*;
import pt.unl.fct.ciai.repository.*;

import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.HashSet;

@Component
public class DatabaseLoader {

    @Bean
    CommandLineRunner initDatabase(UsersRepository users, CompaniesRepository companies,
                                   EmployeesRepository employees, ProposalsRepository proposals,
                                   SectionsRepository sections, ReviewsRepository reviews,
                                   CommentsRepository comments, PasswordEncoder encoder) {

        return args -> {

            //	-	-	-	-	-	-	-	USERS	-	-	-	-	-	-	-

            User sysAdmin = new User()
                    .firstName("admin")
                    .lastName("admin")
                    .username("admin")
                    .password(encoder.encode("password"))
                    .email("admin@admin.pt")
                    .role(User.Role.ROLE_SYS_ADMIN);
            sysAdmin = users.save(sysAdmin);

            User manuel = new User()
                    .firstName("Manuel")
                    .lastName("Coelho")
                    .username("mcoelho")
                    .email("mcoelho@email.com")
                    .password(encoder.encode("password"))
                    .role(User.Role.ROLE_PROPOSAL_APPROVER);
            manuel = users.save(manuel);

            User andre = new User()
                    .firstName("Andre")
                    .lastName("Oliveira")
                    .username("aoliveira")
                    .email("aoliveira@email.com")
                    .password(encoder.encode("password"))
                    .role(User.Role.ROLE_PROPOSAL_APPROVER);
            andre = users.save(andre);

            //	-	-	-	-	-	-	-	COMPANIES	-	-	-	-	-	-	-

            // FCT
            Company fct = new Company()
                    .name("FCT")
                    .city("Almada")
                    .zipCode("2825-149")
                    .address("Calçada de Alfazina 2")
                    .phone("+351 212948300")
                    .email("fct@email.pt")
                    .fax("+351 212954461");
            fct = companies.save(fct);

            // IST
            Company ist = new Company()
                    .name("IST")
                    .city("Lisboa")
                    .zipCode("1023-240")
                    .address("Av. Rovisco Pais 1")
                    .phone("+351 214233200")
                    .email("ist@ist.pt")
                    .fax("+351 214233268");
            ist = companies.save(ist);

            // ISCTE
            Company iscte = new Company()
                    .name("ISCTE")
                    .city("Lisboa")
                    .zipCode("1649-026")
                    .address("Av. das Forças Armadas")
                    .phone("+351 210464014")
                    .email("iscte@email.pt")
                    .fax("+351 217964710");
            iscte = companies.save(iscte);


            //	-	-	-	-	-	-	-	EMPLOYEES	-	-	-	-	-	-	-

            // EMPLOYEE IST 1
            Employee daniel = (Employee) new Employee()
                    .company(ist)
                    .city("Almada")
                    .address("Caparica")
                    .zipCode("1234-999")
                    .cellPhone("+351 919999999")
                    .homePhone("+351 221000000")
                    .gender(User.Gender.MALE)
                    .salary(750.0)
                    .birthday(new Date())
                    .firstName("Daniel")
                    .lastName("Pimenta")
                    .username("dpimenta")
                    .password(encoder.encode("password"))
                    .email("dpimenta@email.com")
                    .role(User.Role.ROLE_COMPANY_ADMIN);
            daniel = employees.save(daniel);

            // EMPLOYEE IST 2
            Employee joao = (Employee) new Employee()
                    .company(ist)
                    .city("Almada")
                    .address("Caparica")
                    .zipCode("1234-992")
                    .cellPhone("+351 918888888")
                    .homePhone("+351 221212121")
                    .gender(User.Gender.MALE)
                    .salary(1000.0)
                    .birthday(new Date())
                    .firstName("João")
                    .lastName("Reis")
                    .username("jreis")
                    .password(encoder.encode("password"))
                    .email("jreis@email.com");
            joao = employees.save(joao);

            // EMPLOYEE FCT
            Employee luis = (Employee) new Employee()
                    .company(fct)
                    .city("Almada")
                    .address("Caparica")
                    .zipCode("1234-1111")
                    .cellPhone("+351 912222222")
                    .homePhone("+351 221111111")
                    .gender(User.Gender.MALE)
                    .salary(1500.0)
                    .birthday(new Date())
                    .firstName("Luis")
                    .lastName("Martins")
                    .username("lmartins")
                    .password(encoder.encode("password"))
                    .email("lmartins@email.com")
                    .role(User.Role.ROLE_COMPANY_ADMIN);
            luis = employees.save(luis);

            //	-	-	-	-	-	-	-	PROPOSALS	-	-	-	-	-	-	-

            Proposal proposal1 = new Proposal()
                    .title("Churrasco")
                    .description("Fazer um churrasco só com carne de porco.")
                    .staff(Collections.singleton(manuel))
                    .members(Collections.singleton(joao))
                    .reviewBid(Collections.singleton(luis))
                    .proposer(joao);
            manuel.addProposal(proposal1);
            luis.addBid(proposal1);
            joao.addProposal(proposal1);
            proposal1 = proposals.save(proposal1);
            manuel = users.save(manuel);
            luis = employees.save(luis);
            joao = employees.save(joao);

            Proposal proposal2 = new Proposal()
                    .title("Evento Vegan")
                    .description("Fazer um evento com comida vegan.")
                    .staff(Collections.singleton(andre))
                    .members(new HashSet<Employee>(Collections.singleton(joao)))
                    .reviewBid(new HashSet<User>(Arrays.asList(joao, daniel)))
                    .proposer(luis);
            andre.addProposal(proposal2);
            joao.addProposal(proposal2);
            joao.addBid(proposal2);
            daniel.addBid(proposal2);
            luis.addProposal(proposal2);
            proposal2 = proposals.save(proposal2);
            andre = users.save(andre);
            joao = employees.save(joao);
            daniel = employees.save(daniel);
            luis = employees.save(luis);

            Proposal proposal3 = new Proposal()
                    .title("Evento de pesca")
                    .description("Evento de pesca no lago do departamental.")
                    .staff(new HashSet<User>(Arrays.asList(manuel, andre)))
                    .members(new HashSet<Employee>(Arrays.asList(daniel, joao)))
                    .reviewBid(Collections.singleton(luis))
                    .proposer(daniel);
            manuel.addProposal(proposal3);
            andre.addProposal(proposal3);
            joao.addProposal(proposal3);
            luis.addProposal(proposal3);
            daniel.addProposal(proposal3);
            proposal3 = proposals.save(proposal3);
            manuel = users.save(manuel);
            andre = users.save(andre);
            joao = employees.save(joao);
            luis = employees.save(luis);
            daniel = employees.save(daniel);

            //	-	-	-	-	-	-	-	SECTIONS	-	-	-	-	-	-	-

            Section section1 = new Section()
                    .budget(500)
                    .title("Convites")
                    .description("Convidar pessoal para o evento")
                    .goals("Convidar")
                    .material("2 folhas de papel, 3 rolhas de cortiça")
                    .workPlan("1- pegar nas folhas de papel 2- pegar nas rolhas de cortiça")
                    .proposal(proposal1);
            sections.save(section1);

            Section section2 = new Section()
                    .budget(2000)
                    .title("Bifes")
                    .description("Arranjar uns bifes")
                    .goals("Acabar com os porcos")
                    .material("3 facas do talho daquelas mesmo grandes")
                    .workPlan("1- pegar na faca do talho 2- matar porcos")
                    .proposal(proposal1);
            sections.save(section2);

            Section section3 = new Section()
                    .budget(100)
                    .title("Plantas")
                    .description("Arranjar umas plantas")
                    .goals("Matar plantas")
                    .material("Bue papel")
                    .workPlan("1- comer o papel")
                    .proposal(proposal2);
            sections.save(section2);

            Section section4 = new Section()
                    .budget(30000)
                    .title("Isco")
                    .description("Ir à loja comprar iscos")
                    .goals("Obter isco")
                    .material("1 dinheiro")
                    .workPlan("1- pegar no dinheiro 2- ir à loja 3- comprar o isco 4- voltar ao lago")
                    .proposal(proposal3);
            sections.save(section4);

            //	-	-	-	-	-	-	-	REVIEWS	-	-	-	-	-	-	-

            Review review1 = new Review()
                    .classification(5)
                    .title("Review1")
                    .text("A review")
                    .summary("Very good review")
                    .author(luis)
                    .proposal(proposal1);
            reviews.save(review1);

            Review review2 = new Review()
                    .classification(3)
                    .title("Review2")
                    .text("Meh... not so good review")
                    .summary("Not so good")
                    .author(joao)
                    .proposal(proposal1);
            reviews.save(review2);

            Review review3 = new Review()
                    .classification(1)
                    .title("Review3")
                    .text("Very bad review")
                    .summary("Horrible")
                    .author(joao)
                    .proposal(proposal3);
            reviews.save(review3);

            //	-	-	-	-	-	-	-	COMMENTS	-	-	-	-	-	-	-

            Comment comment1 = new Comment()
                    .title("Comment 1")
                    .text("Text Text Text")
                    .author(joao)
                    .proposal(proposal1);
            comments.save(comment1);

            Comment comment2 = new Comment()
                    .title("Comment 2")
                    .text("WORK WORK WORK WORK WORK")
                    .author(daniel)
                    .proposal(proposal2);
            comments.save(comment2);

            Comment comment3 = new Comment()
                    .title("Comment 3")
                    .text("I came here like a wrecking ball")
                    .author(joao)
                    .proposal(proposal3);
            comments.save(comment3);

            Comment comment4 = new Comment()
                    .title("Comment 4")
                    .text("I ")
                    .author(daniel)
                    .proposal(proposal3);
            comments.save(comment4);

        };
    }


}
