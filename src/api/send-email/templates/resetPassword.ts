export const resetPassword = (url: string, userName: string) => {
  return `
    <div>
    <h3>Hola ${userName} !</h3>
    <p>Esperamos que este mensaje te encuentre bien. Parece que has olvidado tu contraseña. No te preocupes, estamos aquí para ayudarte a recuperar el acceso a tu cuenta.</p>
    <p>Para restablecer tu contraseña, simplemente haz clic en el siguiente enlace:
    </p>
    <a href=${url}>Reestabler contraseña</a>
    <br>
    <p>Ten en cuenta que este enlace caducará en 10 minutos, así que asegúrate de restablecer tu contraseña lo antes posible. </p>
    <p>Si no solicitaste un restablecimiento de contraseña, por favor ignora este correo electrónico. Tu cuenta sigue siendo segura y no se han realizado cambios.</p>
    <p>Si tienes algún problema, contacta a nuestro equipo de soporte en wsp.clone.arg@gmail.com.</p>
    <p>Saludos cordiales,</p>
    <p> El equipo de WSP</p>
    </div>
    `;
};
