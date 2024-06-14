/*
  Warnings:

  - The values [WAITLISTED] on the enum `JobApplications_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `jobapplications` MODIFY `status` ENUM('APPLIED', 'WAIT_LISTED', 'REJECTED', 'HIRED', 'COMPLETED') NOT NULL DEFAULT 'APPLIED';
