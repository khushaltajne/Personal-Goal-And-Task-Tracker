-- Defer initialization ensures these run AFTER Hibernate creates/updates the tables
ALTER TABLE daily_tasks ALTER COLUMN monthly_goal_id DROP NOT NULL;
ALTER TABLE monthly_goal ALTER COLUMN yearly_goal_id DROP NOT NULL;
ALTER TABLE note ALTER COLUMN task_id DROP NOT NULL;
