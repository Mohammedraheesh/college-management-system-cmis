package com.cms.service.impl;

import com.cms.exception.ResourceNotFoundException;
import com.cms.model.dto.FeeResponse;
import com.cms.model.entity.Fee;
import com.cms.model.entity.Student;
import com.cms.repository.FeeRepository;
import com.cms.repository.StudentRepository;
import com.cms.service.FeeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service implementation for managing Fee entities.
 */
@Service
public class FeeServiceImpl implements FeeService {

    private static final Logger log = LoggerFactory.getLogger(FeeServiceImpl.class);

    private final FeeRepository feeRepository;
    private final StudentRepository studentRepository;

    @Autowired
    public FeeServiceImpl(FeeRepository feeRepository, StudentRepository studentRepository) {
        this.feeRepository = feeRepository;
        this.studentRepository = studentRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public FeeResponse getFeeByStudentId(Long studentId) {
        log.debug("Fetching fee details for student ID: {}", studentId);
        Fee fee = feeRepository.findByStudentId(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Fee record not found for Student ID: " + studentId));
        return mapToDto(fee);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FeeResponse> getAllFees() {
        log.debug("Fetching all fee records");
        return feeRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<FeeResponse> searchFees(String query) {
        log.debug("Searching fee records matching query: {}", query);
        if (query == null || query.trim().isEmpty()) {
            return getAllFees();
        }
        return feeRepository.searchFeesByStudent(query.trim()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public FeeResponse createOrUpdateFee(FeeResponse feeDto) {
        log.debug("Saving fee record for student ID: {}", feeDto.getStudentId());
        Student student = studentRepository.findById(feeDto.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + feeDto.getStudentId()));

        // Check if fee record already exists for the student. If so, update it.
        Fee fee = feeRepository.findByStudentId(feeDto.getStudentId())
                .orElse(new Fee());

        fee.setStudent(student);
        fee.setTotalFee(feeDto.getTotalFee());
        fee.setAmountPaid(feeDto.getAmountPaid());
        fee.setDueDate(feeDto.getDueDate());
        
        // Note: balanceDue is automatically calculated via @PrePersist / @PreUpdate inside the Fee entity
        Fee savedFee = feeRepository.save(fee);
        return mapToDto(savedFee);
    }

    @Override
    @Transactional
    public void deleteFee(Long id) {
        log.debug("Deleting fee record with ID: {}", id);
        if (!feeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Fee record not found with ID: " + id);
        }
        feeRepository.deleteById(id);
    }

    private FeeResponse mapToDto(Fee fee) {
        return FeeResponse.builder()
                .id(fee.getId())
                .studentId(fee.getStudent().getId())
                .studentName(fee.getStudent().getName())
                .totalFee(fee.getTotalFee())
                .amountPaid(fee.getAmountPaid())
                .balanceDue(fee.getBalanceDue())
                .dueDate(fee.getDueDate())
                .build();
    }
}
