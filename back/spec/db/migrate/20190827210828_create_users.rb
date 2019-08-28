class CreateUsers < ActiveRecord::Migration[6.0]
  def change
    create_table :users do |t|
      t.int :uid
      t.text :ver

      t.timestamps
    end
  end
end
