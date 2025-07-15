import { Container, decorate, injectable } from "inversify";
import { bindUseCases } from "@containers/useCases";
import { bindControllers } from "@containers/controllers";
import { bindRepositories } from "@containers/repositories";
import { bindServices } from "@containers/services";
// import { bindMiddleware } from "@containers/middleware";
import { bindSubscriptions } from "@containers/subscriptions";
import { Controller } from "tsoa";

export const iocContainer = new Container();
decorate(injectable(), Controller);
// Bind all dependencies
bindUseCases(iocContainer);
bindControllers(iocContainer);
bindRepositories(iocContainer);
bindServices(iocContainer);
// bindMiddleware(iocContainer);
bindSubscriptions(iocContainer);
