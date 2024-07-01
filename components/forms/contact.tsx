import type { JSX } from "preact";
import { useSignal } from "@preact/signals";
import { invoke } from "$store/runtime.ts";
import { debounce } from "std/async/debounce.ts";

interface InputProps extends JSX.HTMLAttributes<HTMLInputElement> {
  id: string;
  name?: string;
  placeholder: string;
  label: string;
  type?: "text" | "email";
}

interface ContactSettings {
  /**
   * @title Acronym
   * @description The entity to be used in the Masterdata API
   */
  acronym: string;
}
export interface Props {
  form?: {
    /**
     * @title Texto do botão de enviar
     */
    submitText?: string;
  };
  /**
   * @title Configurações
   */
  settings: ContactSettings;
}

function Input(
  { id, name = id, placeholder, label, type = "text", ...rest }: InputProps,
) {
  return (
    <div class="w-full relative">
      <div class="flex w-full mb-2 justify-between items-center">
        <label
          htmlFor={`fc_${id}`}
          class="text-black text-sm leading-[15px]"
        >
          {label}
        </label>
      </div>

      <input
        required
        type={type}
        name={name}
        id={`fc_${id}`}
        class="w-full bg-white h-12 px-4 focus:outline-none text-sm placeholder:text-gray-400 text-neutral border border-gray-300"
        placeholder={placeholder}
        {...rest}
      />
    </div>
  );
}

export const ContactForm = (
  { form = { submitText: "Enviar" }, settings }: Props,
) => {
  const { acronym } = settings;
  const succeeded = useSignal(false);
  const loading = useSignal(false);

  const formData = useSignal({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = debounce(
    (e: React.TargetedEvent<HTMLInputElement | HTMLTextAreaElement, Event>) => {
      const target = e.target as HTMLInputElement;
      if (!target) return;

      formData.value = {
        ...formData.value,
        [target.name]: target.value,
      };
    },
    200,
  );

  const onSubmit: JSX.GenericEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    loading.value = true;

    const data = {
      email: formData.value.email,
      name: formData.value.name,
      message: formData.value.message,
    };

    try {
      await invoke.vtex.actions.masterdata.createDocument({
        acronym: acronym ?? "FC",
        data,
      });

      succeeded.value = true;
    } catch (error) {
      console.error("ERROR", error);
      alert("Erro ao enviar mensagem");
    }

    loading.value = false;
  };

  return (
    <div>
      <h1 class="text-neutral-700 text-2xl font-bold border-b border-neutral-700 pb-4 font-secondary">
        Fale Conosco
      </h1>
      <div class="flex flex-col mt-7">
        {succeeded.value
          ? (
            <div class="w-full flex flex-col justify-center items-center">
              <span class="my-4">Mensagem enviada com sucesso!</span>
              <button
                class="btn btn-primary w-full h-[40px] duration-300 disabled:bg-disabled-btn disabled:cursor-pointer max-w-[350px]"
                onClick={() => window.location.reload()}
              >
                <span class="group-disabled:loading font-bold">
                  Voltar
                </span>
              </button>
            </div>
          )
          : (
            <form onSubmit={onSubmit} class="w-full">
              <div class="flex flex-col gap-7 mb-1">
                <Input
                  id="name"
                  label="Nome"
                  placeholder="Digite seu nome"
                  onChange={handleChange}
                />
                <Input
                  id="email"
                  label="E-mail"
                  placeholder="Digite seu e-mail"
                  type="email"
                  onChange={handleChange}
                />

                <div class="flex items-center relative">
                  <label htmlFor="fc_message" class="xl:pb-0 w-full">
                    <span class="text-black text-sm leading-[15px] mb-2 block">
                      Mensagem
                    </span>
                    <textarea
                      required
                      id="fc_message"
                      name="message"
                      placeholder="Digite sua mensagem"
                      class="w-full p-4 bg-white focus:outline-none text-sm placeholder:text-gray-400 text-neutral border border-gray-300 resize-none"
                      rows={7}
                      cols={50}
                      onChange={handleChange}
                    />
                  </label>
                </div>
                <div class="w-full flex mb-7 lg:max-w-[260px]">
                  <button
                    disabled={loading}
                    type="submit"
                    class="btn btn-primary w-full h-[40px] duration-300 disabled:bg-disabled-btn disabled:cursor-pointer group"
                  >
                    <span class="group-disabled:loading font-bold">
                      {form?.submitText ?? "Enviar"}
                    </span>
                  </button>
                </div>
              </div>
            </form>
          )}
      </div>
    </div>
  );
};
