class CreateMessages < ActiveRecord::Migration[6.0]
  def change
    create_table :messages do |t|
      t.text :from
      t.text :to
      t.timestamp :sent
      t.text :msg

      t.timestamps
    end
  end
end
