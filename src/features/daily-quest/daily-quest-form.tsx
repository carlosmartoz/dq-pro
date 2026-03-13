import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup } from "@/components/ui/field"
import { ButtonGroup } from "@/components/ui/button-group"

export function DailyQuestForm({
  onAdd,
}: {
  onAdd: (title: string) => void
}) {
  const [title, setTitle] = useState("")

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()

    onAdd(title)

    setTitle("")
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <FieldGroup>
        <Field>
          <ButtonGroup>
            <Input
              required
              value={title}
              autoComplete="off"
              id="input-button-group"
              placeholder="Add a quest for today"
              className="text-sm! placeholder:text-sm"
              onChange={(event) => setTitle(event.target.value)}
            />

            <Button
              type="submit"
              variant="outline"
              className="cursor-pointer text-sm transition-all duration-300"
            >
              Add
            </Button>
          </ButtonGroup>
        </Field>
      </FieldGroup>
    </form>
  )
}

