package com.cms.config;

import com.cms.model.entity.*;
import com.cms.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final MarkRepository markRepository;
    private final FeeRepository feeRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            UserRepository userRepository,
            StudentRepository studentRepository,
            CourseRepository courseRepository,
            MarkRepository markRepository,
            FeeRepository feeRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
        this.markRepository = markRepository;
        this.feeRepository = feeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // If data already exists, don't seed the database
        if (userRepository.count() > 0 || courseRepository.count() > 0) {
            return;
        }

        System.out.println("=========================================================");
        System.out.println("       SEEDING CMIS DATABASE WITH DEVELOPMENT DATA       ");
        System.out.println("=========================================================");

        // 1. Create Default Admin User
        User adminUser = User.builder()
                .email("admin@college.com")
                .passwordHash(passwordEncoder.encode("admin123"))
                .role(Role.ROLE_ADMIN)
                .build();
        userRepository.save(adminUser);
        System.out.println("✔ Created Admin User (admin@college.com / admin123)");

        // 2. Create Courses
        Course cs101 = Course.builder()
                .courseCode("CS-101")
                .courseName("Introduction to Computer Science")
                .department("Computer Science & Engineering")
                .credits(3)
                .description("Basic concepts of computer programming, algorithms, and logical design using Java.")
                .build();

        Course cs301 = Course.builder()
                .courseCode("CS-301")
                .courseName("Advanced Data Structures")
                .department("Computer Science & Engineering")
                .credits(4)
                .description("In-depth study of trees, graphs, sorting, searching, and algorithm complexity analysis.")
                .build();

        Course cs202 = Course.builder()
                .courseCode("CS-202")
                .courseName("Object-Oriented Programming")
                .department("Computer Science & Engineering")
                .credits(3)
                .description("Principles of OOP: encapsulation, inheritance, polymorphism, and modular software design.")
                .build();

        Course ec201 = Course.builder()
                .courseCode("EC-201")
                .courseName("Signals & Systems")
                .department("Electronics & Communication")
                .credits(4)
                .description("Analysis of continuous and discrete-time signals, Fourier series, and Laplace transforms.")
                .build();

        Course ec302 = Course.builder()
                .courseCode("EC-302")
                .courseName("Microprocessors")
                .department("Electronics & Communication")
                .credits(4)
                .description("Assembly level design, CPU architecture, interface mapping, and register controls.")
                .build();

        courseRepository.saveAll(List.of(cs101, cs301, cs202, ec201, ec302));
        System.out.println("✔ Created 5 Courses");

        // 3. Create Student Users & Student Profiles
        
        // Student A: Alice Johnson
        User aliceUser = User.builder()
                .email("alice.student@college.edu")
                .passwordHash(passwordEncoder.encode("password123"))
                .role(Role.ROLE_STUDENT)
                .build();
        userRepository.save(aliceUser);

        Student alice = Student.builder()
                .name("Alice Johnson")
                .email("alice.student@college.edu")
                .department("Computer Science & Engineering")
                .year(3)
                .user(aliceUser)
                .build();
        studentRepository.save(alice);
        System.out.println("✔ Created Student: Alice Johnson (alice.student@college.edu / password123)");

        // Student B: Bob Smith
        User bobUser = User.builder()
                .email("bob.student@college.edu")
                .passwordHash(passwordEncoder.encode("password123"))
                .role(Role.ROLE_STUDENT)
                .build();
        userRepository.save(bobUser);

        Student bob = Student.builder()
                .name("Bob Smith")
                .email("bob.student@college.edu")
                .department("Electronics & Communication")
                .year(2)
                .user(bobUser)
                .build();
        studentRepository.save(bob);
        System.out.println("✔ Created Student: Bob Smith (bob.student@college.edu / password123)");

        // Student C: Charlie Davis
        User charlieUser = User.builder()
                .email("charlie.student@college.edu")
                .passwordHash(passwordEncoder.encode("password123"))
                .role(Role.ROLE_STUDENT)
                .build();
        userRepository.save(charlieUser);

        Student charlie = Student.builder()
                .name("Charlie Davis")
                .email("charlie.student@college.edu")
                .department("Computer Science & Engineering")
                .year(1)
                .user(charlieUser)
                .build();
        studentRepository.save(charlie);
        System.out.println("✔ Created Student: Charlie Davis (charlie.student@college.edu / password123)");

        // Student D: David Miller
        User davidUser = User.builder()
                .email("david.student@college.edu")
                .passwordHash(passwordEncoder.encode("password123"))
                .role(Role.ROLE_STUDENT)
                .build();
        userRepository.save(davidUser);

        Student david = Student.builder()
                .name("David Miller")
                .email("david.student@college.edu")
                .department("Computer Science & Engineering")
                .year(2)
                .user(davidUser)
                .build();
        studentRepository.save(david);
        System.out.println("✔ Created Student: David Miller (david.student@college.edu / password123)");

        // Student E: Emma Wilson
        User emmaUser = User.builder()
                .email("emma.student@college.edu")
                .passwordHash(passwordEncoder.encode("password123"))
                .role(Role.ROLE_STUDENT)
                .build();
        userRepository.save(emmaUser);

        Student emma = Student.builder()
                .name("Emma Wilson")
                .email("emma.student@college.edu")
                .department("Computer Science & Engineering")
                .year(4)
                .user(emmaUser)
                .build();
        studentRepository.save(emma);
        System.out.println("✔ Created Student: Emma Wilson (emma.student@college.edu / password123)");

        // Student F: Frank Thomas
        User frankUser = User.builder()
                .email("frank.student@college.edu")
                .passwordHash(passwordEncoder.encode("password123"))
                .role(Role.ROLE_STUDENT)
                .build();
        userRepository.save(frankUser);

        Student frank = Student.builder()
                .name("Frank Thomas")
                .email("frank.student@college.edu")
                .department("Electronics & Communication")
                .year(3)
                .user(frankUser)
                .build();
        studentRepository.save(frank);
        System.out.println("✔ Created Student: Frank Thomas (frank.student@college.edu / password123)");

        // 4. Create Fee Statements
        Fee aliceFee = Fee.builder()
                .student(alice)
                .totalFee(new BigDecimal("5000.00"))
                .amountPaid(new BigDecimal("4200.00"))
                .dueDate(LocalDate.now().plusMonths(2))
                .build();

        Fee bobFee = Fee.builder()
                .student(bob)
                .totalFee(new BigDecimal("6000.00"))
                .amountPaid(new BigDecimal("6000.00"))
                .dueDate(LocalDate.now().plusMonths(1))
                .build();

        Fee charlieFee = Fee.builder()
                .student(charlie)
                .totalFee(new BigDecimal("5000.00"))
                .amountPaid(new BigDecimal("1500.00"))
                .dueDate(LocalDate.now().plusWeeks(3))
                .build();

        Fee davidFee = Fee.builder()
                .student(david)
                .totalFee(new BigDecimal("5000.00"))
                .amountPaid(new BigDecimal("5000.00"))
                .dueDate(LocalDate.now().plusMonths(3))
                .build();

        Fee emmaFee = Fee.builder()
                .student(emma)
                .totalFee(new BigDecimal("5500.00"))
                .amountPaid(new BigDecimal("4000.00"))
                .dueDate(LocalDate.now().plusMonths(2))
                .build();

        Fee frankFee = Fee.builder()
                .student(frank)
                .totalFee(new BigDecimal("6000.00"))
                .amountPaid(new BigDecimal("2500.00"))
                .dueDate(LocalDate.now().plusWeeks(2))
                .build();

        feeRepository.saveAll(List.of(aliceFee, bobFee, charlieFee, davidFee, emmaFee, frankFee));
        System.out.println("✔ Created 6 Fee Statements");

        // 5. Create Academic Marks
        
        // Alice Marks
        Mark aliceMark1 = Mark.builder()
                .student(alice)
                .course(cs101)
                .internalMarks(28.5)
                .endExamMarks(62.0)
                .build();

        Mark aliceMark2 = Mark.builder()
                .student(alice)
                .course(cs301)
                .internalMarks(24.0)
                .endExamMarks(55.5)
                .build();

        Mark aliceMark3 = Mark.builder()
                .student(alice)
                .course(cs202)
                .internalMarks(29.0)
                .endExamMarks(65.0)
                .build();

        // Bob Marks
        Mark bobMark1 = Mark.builder()
                .student(bob)
                .course(ec201)
                .internalMarks(22.0)
                .endExamMarks(48.5)
                .build();

        Mark bobMark2 = Mark.builder()
                .student(bob)
                .course(ec302)
                .internalMarks(26.5)
                .endExamMarks(50.0)
                .build();

        // Charlie Marks
        Mark charlieMark1 = Mark.builder()
                .student(charlie)
                .course(cs101)
                .internalMarks(25.0)
                .endExamMarks(51.0)
                .build();

        // David Marks
        Mark davidMark1 = Mark.builder()
                .student(david)
                .course(cs101)
                .internalMarks(22.0)
                .endExamMarks(45.0)
                .build();

        Mark davidMark2 = Mark.builder()
                .student(david)
                .course(cs202)
                .internalMarks(26.0)
                .endExamMarks(50.0)
                .build();

        // Emma Marks
        Mark emmaMark1 = Mark.builder()
                .student(emma)
                .course(cs301)
                .internalMarks(28.0)
                .endExamMarks(61.0)
                .build();

        Mark emmaMark2 = Mark.builder()
                .student(emma)
                .course(cs202)
                .internalMarks(27.5)
                .endExamMarks(59.0)
                .build();

        // Frank Marks
        Mark frankMark1 = Mark.builder()
                .student(frank)
                .course(ec201)
                .internalMarks(18.0)
                .endExamMarks(35.0)
                .build();

        Mark frankMark2 = Mark.builder()
                .student(frank)
                .course(ec302)
                .internalMarks(21.5)
                .endExamMarks(42.0)
                .build();

        markRepository.saveAll(List.of(
                aliceMark1, aliceMark2, aliceMark3, 
                bobMark1, bobMark2, 
                charlieMark1, 
                davidMark1, davidMark2, 
                emmaMark1, emmaMark2, 
                frankMark1, frankMark2
        ));
        System.out.println("✔ Created 12 Academic Mark Records");
        System.out.println("=========================================================");
    }
}
