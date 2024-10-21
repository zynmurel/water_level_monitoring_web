"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { useStore } from "@/lib/store/app";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import Loading from "./_components/loading";
import ClearWaterFlowModal from "./_components/clear-flow-modal";
import axios from "axios";

const SettingsPage = () => {
  const { user } = useStore();
  const [openClearFlow, setOpenClearFlow] = useState(false);
  const [openClearTide, setOpenClearTide] = useState(false);
  const [employeeId, setEmployeeId] = useState({
    id: 0,
    employeeID: "",
  });
  const [employeePassword, setEmployeePassword] = useState({
    id: 0,
    isChangesPass: false,
    password: {
      value: "",
      show: false,
    },
    newPassword: {
      value: "",
      show: false,
    },
    confirmNewPassword: {
      value: "",
      show: false,
    },
  });
  const { data: settings, isPending } = api.account.getAccountDetails.useQuery(
    {
      id: user?.id || 0,
    },
    {
      enabled: !!user?.id,
    },
  );

  const onSuccess = ({ description }: { description: string }) => {
    toast({
      title: "Saved!",
      description,
    });
  };

  const { mutate: updateEmployeeID, isPending: updateEmployeeIDIsPending } =
    api.account.updateEmployeeID.useMutation({
      onSuccess: () =>
        onSuccess({ description: "Employee ID updated successfully." }),
    });

  const {
    mutate: updateSuperAdminPass,
    isPending: updateSuperAdminPassIsPending,
  } = api.account.updateAdminPass.useMutation({
    onSuccess: () => {
      onSuccess({ description: "Password reset to default password." });
      setEmployeePassword({
        id: 0,
        isChangesPass: false,
        password: {
          value: "",
          show: false,
        },
        newPassword: {
          value: "",
          show: false,
        },
        confirmNewPassword: {
          value: "",
          show: false,
        },
      });
    },
    onError: (e) => {
      toast({
        variant: "destructive",
        title: "Failed",
        description: e.message,
      });
    },
  });

  const onChangePassword = () => {
    if (
      employeePassword.newPassword.value.length < 8 ||
      employeePassword.password.value.length < 8
    ) {
      toast({
        variant: "destructive",
        title: "Input Error!",
        description: "Password must be longer than 8 characters.",
      });
    } else if (
      employeePassword.newPassword.value !==
      employeePassword.confirmNewPassword.value
    ) {
      toast({
        variant: "destructive",
        title: "Input Error!",
        description: "Password does not match.",
      });
    } else {
      updateSuperAdminPass({
        id: employeePassword.id,
        password: employeePassword.password.value,
        newPassword: employeePassword.newPassword.value,
      });
    }
  };

  useEffect(() => {
    if (settings) {
      const { id, username } = settings;
      setEmployeeId({
        id,
        employeeID: username,
      });
      setEmployeePassword((prev) => ({
        ...prev,
        id,
      }));
    }
  }, [settings]);
  return (
    <div className="grid w-full gap-2 xl:w-[700px]">
      <Button
        onClick={async () => {
            await fetch('https://water-level-monitoring-web.vercel.app/api/water-flow-sensor', {
                method: 'POST', // HTTP method
                headers: {
                  'Content-Type': 'application/json', // Specify JSON format
                },
                body: JSON.stringify({
                    value: "100",
                  }), // Convert the data to a JSON string
              })
        }}
      >
        try
      </Button>
      <div className="flex flex-col">
        <h3 className="text-2xl font-bold tracking-tight">Account</h3>
        <p className="text-sm text-muted-foreground">
          Update account credentials.
        </p>
      </div>
      <div>
        <Card x-chunk="dashboard-04-chunk-1" className="relative w-full">
          {isPending && (
            <div
              className="absolute bottom-0 left-0 right-0 top-0 z-10 flex items-center justify-center bg-background bg-opacity-50"
              style={{ opacity: 0.5 }}
            >
              <Loading />
            </div>
          )}
          <CardHeader>
            <CardTitle>Admin</CardTitle>
            <CardDescription>
              This is the username of the admin.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-4 md:flex-row">
              <div className="flex-1">
                <div className="text-sm">Employee ID</div>
                <Input
                  value={employeeId.employeeID}
                  onChange={(e) =>
                    setEmployeeId((prev) => ({
                      ...prev,
                      employeeID: e.target.value,
                    }))
                  }
                  placeholder="Employee ID"
                />
              </div>

              <Button
                className="px-6"
                disabled={updateEmployeeIDIsPending}
                onClick={() =>
                  updateEmployeeID({
                    ...employeeId,
                  })
                }
              >
                Save
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <div></div>
      <div>
        <Card x-chunk="dashboard-04-chunk-1" className="relative w-full">
          {isPending && (
            <div
              className="absolute bottom-0 left-0 right-0 top-0 z-10 flex items-center justify-center bg-background bg-opacity-50"
              style={{ opacity: 0.5 }}
            >
              <Loading />
            </div>
          )}
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              Change password settings for admin.
            </CardDescription>
          </CardHeader>
          {employeePassword.isChangesPass ? (
            <CardContent className="space-y-5">
              <div>
                <div className="text-sm">Password</div>
                <div className="flex w-full flex-row items-center gap-2">
                  <Input
                    type={employeePassword.password.show ? "text" : "password"}
                    className="xl:w-[400px]"
                    value={employeePassword.password.value}
                    onChange={(e) =>
                      setEmployeePassword((prev) => ({
                        ...prev,
                        password: {
                          ...prev.password,
                          value: e.target.value,
                        },
                      }))
                    }
                    placeholder="Input password"
                  />
                  <div
                    onClick={() =>
                      setEmployeePassword((prev) => ({
                        ...prev,
                        password: {
                          ...prev.password,
                          show: !prev.password.show,
                        },
                      }))
                    }
                    className="cursor-pointer text-sm text-gray-600"
                  >
                    {employeePassword.password.show ? "Hide" : "Show"}
                  </div>
                </div>
              </div>
              <div>
                <div className="text-sm">New Password</div>
                <div className="flex w-full flex-row items-center gap-2">
                  <Input
                    type={
                      employeePassword.newPassword.show ? "text" : "password"
                    }
                    className="xl:w-[400px]"
                    value={employeePassword.newPassword.value}
                    onChange={(e) =>
                      setEmployeePassword((prev) => ({
                        ...prev,
                        newPassword: {
                          ...prev.newPassword,
                          value: e.target.value,
                        },
                      }))
                    }
                    placeholder="Input new password"
                  />
                  <div
                    onClick={() =>
                      setEmployeePassword((prev) => ({
                        ...prev,
                        password: {
                          ...prev.newPassword,
                          show: !prev.newPassword.show,
                        },
                      }))
                    }
                    className="cursor-pointer text-sm text-gray-600"
                  >
                    {employeePassword.newPassword.show ? "Hide" : "Show"}
                  </div>
                </div>
              </div>
              <div>
                <div className="text-sm">Confirm Password</div>
                <div className="flex w-full flex-row items-center gap-2">
                  <Input
                    type={
                      employeePassword.confirmNewPassword.show
                        ? "text"
                        : "password"
                    }
                    className="xl:w-[400px]"
                    value={employeePassword.confirmNewPassword.value}
                    onChange={(e) =>
                      setEmployeePassword((prev) => ({
                        ...prev,
                        confirmNewPassword: {
                          ...prev.confirmNewPassword,
                          value: e.target.value,
                        },
                      }))
                    }
                    placeholder="Input password"
                  />
                  <div
                    onClick={() =>
                      setEmployeePassword((prev) => ({
                        ...prev,
                        password: {
                          ...prev.confirmNewPassword,
                          show: !prev.confirmNewPassword.show,
                        },
                      }))
                    }
                    className="cursor-pointer text-sm text-gray-600"
                  >
                    {employeePassword.confirmNewPassword.show ? "Hide" : "Show"}
                  </div>
                </div>
              </div>
            </CardContent>
          ) : (
            <div></div>
          )}

          <div className="px-6 pb-6">
            {employeePassword.isChangesPass ? (
              <div className="flex flex-row gap-1">
                <Button
                  variant={"outline"}
                  onClick={() =>
                    setEmployeePassword((prev) => ({
                      ...prev,
                      isChangesPass: false,
                    }))
                  }
                >
                  Cancel
                </Button>
                <Button
                  className="px-6"
                  disabled={updateSuperAdminPassIsPending}
                  onClick={() => onChangePassword()}
                >
                  Save
                </Button>
              </div>
            ) : (
              <div>
                <p className="h-5"></p>
                <Button
                  className="px-6"
                  onClick={() =>
                    setEmployeePassword((prev) => ({
                      ...prev,
                      isChangesPass: true,
                    }))
                  }
                >
                  Change
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="mt-10 flex flex-col">
        <h3 className="text-2xl font-bold tracking-tight">Manage Data</h3>
        <p className="text-sm text-muted-foreground">
          Clear existing data for water flow and tide.
        </p>
      </div>
      <div>
        <Card x-chunk="dashboard-04-chunk-1" className="relative w-full">
          {isPending && (
            <div
              className="absolute bottom-0 left-0 right-0 top-0 z-10 flex items-center justify-center bg-background bg-opacity-50"
              style={{ opacity: 0.5 }}
            >
              <Loading />
            </div>
          )}
          <CardHeader>
            <CardTitle>Clear Water Flow Data</CardTitle>
            <CardDescription>
              To ensure the accuracy and clarity of your water flow data, you
              can reset the data at any time. Follow these steps to clear all
              existing water flow records.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ClearWaterFlowModal
              open={openClearFlow}
              setOpen={setOpenClearFlow}
            />
            <Button
              onClick={() => setOpenClearFlow(true)}
              className="px-20"
              variant={"destructive"}
            >
              Clear Water Flow Data
            </Button>
          </CardContent>
        </Card>

        <Card x-chunk="dashboard-04-chunk-1" className="relative mt-5 w-full">
          {isPending && (
            <div
              className="absolute bottom-0 left-0 right-0 top-0 z-10 flex items-center justify-center bg-background bg-opacity-50"
              style={{ opacity: 0.5 }}
            >
              <Loading />
            </div>
          )}
          <CardHeader>
            <CardTitle>Clear Water Tide Level Data</CardTitle>
            <CardDescription>
              To maintain accurate records, you can reset the water tide level
              data when needed. Follow these steps to clear all existing tide
              level records.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ClearWaterFlowModal
              open={openClearTide}
              setOpen={setOpenClearTide}
            />
            <Button
              onClick={() => setOpenClearTide(true)}
              className="px-20"
              variant={"destructive"}
            >
              Clear Water Tide Level Data
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
