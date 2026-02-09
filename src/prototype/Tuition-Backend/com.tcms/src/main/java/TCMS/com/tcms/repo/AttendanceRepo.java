package TCMS.com.tcms.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import TCMS.com.tcms.model.Attendance;

public interface AttendanceRepo extends JpaRepository<Attendance, Integer> {}
