ALTER TABLE profiles ADD COLUMN siliconflow_api_key TEXT CHECK (char_length(siliconflow_api_key) <= 1000);
