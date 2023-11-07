import { RadioGroup } from "@headlessui/react";
import { UserType } from "~/utils/dbSchema/enums";

export type UserTypeDescription = {
  type: UserType.CANDIDATE | UserType.EMPLOYER;
  description: string;
};

const userTypes: UserTypeDescription[] = [
  {
    type: UserType.EMPLOYER,
    description: "Я роботодавець - шукаю розробників",
  },
  {
    type: UserType.CANDIDATE,
    description: "Я кандидат - шукаю пропозиції",
  },
];

export function SelectUserType({
  userType,
  onUserTypeChange,
}: {
  userType: UserTypeDescription | undefined;
  onUserTypeChange: (value: UserTypeDescription) => void;
}) {
  return (
    <div className="mx-auto w-full text-sm font-medium leading-6 text-gray-900">
      Оберіть тип користувача:
      <RadioGroup
        value={userType || ""}
        onChange={onUserTypeChange}
        className="mt-2"
      >
        <div className="space-y-2">
          {userTypes.map((user) => (
            <RadioGroup.Option
              key={user.type}
              value={user}
              className={({ checked }) =>
                `${
                  checked ? "bg-blue-600 bg-opacity-75 text-white" : "bg-white"
                }
                    relative flex w-full cursor-pointer rounded-md px-3 py-3 shadow-sm ring-1 ring-inset ring-gray-300`
              }
            >
              {({ checked }) => (
                <div className="flex w-full items-center justify-between">
                  <div className="text-sm">
                    <RadioGroup.Label
                      as="p"
                      className={`font-medium  ${
                        checked ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {user.description}
                    </RadioGroup.Label>
                  </div>
                  {checked && (
                    <div className="shrink-0 text-white">
                      <CheckIcon />
                    </div>
                  )}
                </div>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
      <path
        d="M7 13l3 3 7-7"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
