DO $$ 
BEGIN
    -- Drop existing trigger if it exists
    DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
    
    -- Drop existing function if it exists
    DROP FUNCTION IF EXISTS update_updated_at_column();

    -- Create the function
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
    END;
    $$ language 'plpgsql';

    -- Create the trigger
    CREATE TRIGGER update_projects_updated_at
        BEFORE UPDATE ON projects
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
END $$;